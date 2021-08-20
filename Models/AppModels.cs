using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using EventsStorage.Infrastructure;
using System;

namespace EventsStorage.Models
{
    public class AddEventModel
    {
        [Required]
        public int SubjectId { get; set; }
        [Required]
        public string Description { get; set; }
    }

    public class AddSubjectModel
    {
        [Required]
        public string name { get; set; }

        [Required]
        public DateTime createdOn { get; set; }
    }

    public class SubjectsModel
    {
        public string search { get; set; }
        public int[] exclude { get; set; }
    }

    public class UploadEventFileModel
    {
        [Required]
        public long eventId { get; set; }
        [Required]
        public IFormFile formFile { get; set; }
    }

    public class EventsModel
    {
        public int? offset { get; set; }
        public int? count { get; set; }
        public int[] subjects { get; set; }
    }
    public class EventListModel
    {
        public AppEvent[] events { get; set; }
        public EventSubject[] subjects { get; set; }
        public int offset { get; set; }
        public int count { get; set; }
        public int total { get; set; }
    }
    public class DeleteFileModel
    {
        [Required]
        public long id { get; set; }
    }

    public class DeleteEventsModel
    {
        [Required]
        public long[] ids { get; set; }
    }
}
