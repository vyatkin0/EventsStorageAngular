# EventsStorageAngular
Example of asp .net 5.0 single page web application that based on Angular Material Design web components.

It is available for playing by url https://events-storage-angular-fcn7f4ebeq-uc.a.run.app/

These are generic installation instructions.

Edit database connection string in file appsettings.json;

Download and install ASP.NET SDK 5.0;

In the solution's folder execute following commands:

* dotnet restore
* dotnet tool install --global dotnet-ef
* dotnet ef migrations add Initial
* dotnet ef database update
* dotnet build
* dotnet run

Application is running now on a local web-server with url https://localhost:5001

To deploy application on IIS execute command:

* dotnet publish --configuration Release

Move files from /bin/Release/net5.0/publish to IIS folder.
