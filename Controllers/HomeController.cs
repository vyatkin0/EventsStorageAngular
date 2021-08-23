using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using EventsStorage.Models;
using EventsStorage.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace EventsStorage.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class HomeController : Controller
    {
        private readonly EventDbContext _ctx;
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger, EventDbContext ctx)
        {
            _logger = logger;
            _ctx = ctx;
        }

        public IActionResult Events(EventsModel model)
        {
            if (!model.offset.HasValue)
            {
                model.offset = 0;
            }

            if (!model.count.HasValue)
            {
                model.count = 10;
            }

            int[] ids = Array.Empty<int>();

            if (model.subjects?.Length>0)
            {
                ids = model.subjects;
            }

            EventSubject[] eventSubjects = _ctx.Subjects
                    .Where(c => ids.Contains(c.Id))
                    .ToArray();

            AppEvent[] events = _ctx.Events
                .Include(e=>e.Files)
                .Include(e=>e.Subject)
                .Where(e=> ids.Length<1 || ids.Contains(e.SubjectId))
                .OrderByDescending(e=>e.Id)
                .Skip(model.offset.Value)
                .Take(model.count.Value)
                .AsNoTracking()
                .ToArray();

            return Ok(new EventListModel
            {
                events = events,
                subjects = eventSubjects,
                offset = model.offset.Value,
                count = model.count.Value,
                total = _ctx.Events.Count()
            });
        }

        [HttpPost]
        public IActionResult GetEvent(GetEventModel model)
        {
            return Ok(_ctx.Events.Include(e=>e.Files)
                .Include(e=>e.Subject)
                .Where(e=> e.Id == model.id)
                .OrderByDescending(e=>e.Id)
                .AsNoTracking()
                .SingleOrDefault());
        }

        [HttpPost]
        public IActionResult UploadFile([FromForm] UploadEventFileModel model)
        {
            EventFile file = new EventFile
            {
                EventId = model.eventId,
                Name = model.formFile.FileName,
                CreatedAt = DateTime.UtcNow
            };

            // Upload the file if less than 10 MB
            if (model.formFile.Length > 10 * 1024 * 1024)
            {
                return BadRequest("File size is greater than 10 Mb");
            }

            using (var memoryStream = new MemoryStream())
            {
                model.formFile.CopyTo(memoryStream);

                file.ContentType = model.formFile.ContentType;
                file.Content = memoryStream.ToArray();
            }

            _ctx.Add(file);
            _ctx.SaveChanges();

            return Ok(file);
        }

        [HttpGet]
        public IActionResult DownloadFile([Required]long id)
        {
            EventFile file = _ctx.Files.SingleOrDefault(f=>f.Id==id);
            if (null == file)
            {
                return BadRequest("File not found");
            }

            string contentType = file.ContentType ?? System.Net.Mime.MediaTypeNames.Application.Octet;

            return File(file.Content, contentType, file.Name);
        }

        [HttpPost]
        public IActionResult Subjects(SubjectsModel model)
        {
            if (string.IsNullOrWhiteSpace(model.search))
            {
                return Ok(Array.Empty<object>());
            }

            bool sortById = false;
            IQueryable<EventSubject> query = null;
            if (ulong.TryParse(model.search, out ulong value))
            {
                sortById = true;
                query = _ctx.Subjects.Where(s => s.Name.Contains(model.search) || s.Id.ToString().Contains(model.search));
            }
            else
            {
                query = _ctx.Subjects.Where(s => s.Name.Contains(model.search) || model.search.StartsWith(s.Id.ToString() /*ToString is required here*/ + " -"));
            }

            var result = query
                .Where(s=>!model.exclude.Contains(s.Id))
                .Take(10)
                .AsNoTracking()
                .AsEnumerable();

            //Using client sort for 10 randomly received items to speedup sql query execution
            if (sortById)
            {
                result = result.OrderBy(s => s.Id).ThenBy(s => s.Name);
            }
            else
            {
                result = result.OrderBy(s=>!model.search.StartsWith(s.Id.ToString() + " -")).ThenBy(s => s.Name);
            }

            return Ok(result.Select(s => new { s.Id, name = HttpUtility.HtmlEncode(s.Name) }));
        }

        [HttpPost]
        public IActionResult AddEvent(AddEventModel model)
        {
            AppEvent e = new AppEvent{
                SubjectId = model.subjectId,
                Description = model.description,
                CreatedAt = DateTime.UtcNow
            };

            _ctx.Events.Add(e);
            _ctx.SaveChanges();

            return Ok(e);
        }

        [HttpPost]
        public IActionResult AddSubject(AddSubjectModel model)
        {
            EventSubject s = new EventSubject{
                Name = model.name,
                CreatedOn = model.createdOn
            };

            _ctx.Subjects.Add(s);
            _ctx.SaveChanges();

            return Ok(s);
        }

        [HttpPost]
        public IActionResult DeleteFile(DeleteFileModel model)
        {
            EventFile file = _ctx.Files.SingleOrDefault(f => f.Id == model.id);
            if (null == file)
            {
                return BadRequest("File not found");
            }

            _ctx.Files.Remove(file);
            _ctx.SaveChanges();

            return Ok(file);
        }

        [HttpPost]
        public IActionResult DeleteEvents(DeleteEventsModel model)
        {
            if(model.ids.Length<1){
                return Json("Success");
            }

            long[] missedIds = model.ids.Where(i=>!_ctx.Events.Any(e=>e.Id==i)).ToArray();
            if (missedIds.Length>0)
            {
                return BadRequest($"Event with id {string.Join(",", missedIds)} not found");
            }

            var events = _ctx.Events.Where(e => model.ids.Contains(e.Id));
            var files = events.Select(e=>e.Files);
            _ctx.Files.RemoveRange(files.SelectMany(f=>f));
            _ctx.Events.RemoveRange(events);
            _ctx.SaveChanges();

            return Json("Success");
        }
    }
}
