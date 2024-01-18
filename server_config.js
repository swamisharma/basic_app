// NOTES:
// * All paths can start with the '~/' prefix which is substituted with the user's home directory
// * Using '/' as the path separator is recommended even on Windows. Using a backslash '\' will be interpreted
//    by a javascript string special character, thus if backslash path separators are used, they will need to be
//    escaped as a double backslash '\\'. If desired, single backslashes can be used with javascript raw
//    strings - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
// * All paths can be either absolute or relative. Each configuration setting indicates what it will be relative 
//   to if that style of path is used, but most paths will be relative to the 'communicatorDir' path. 

// Import configuration types. The path in require() is relative to this file, not to the $CWD
var SpawnerTypes = require("../../server/node/lib/SpawnerTypes");
var LogTimeFormat = SpawnerTypes.LogTimeFormat;
var LogSpawnCategory = SpawnerTypes.LogSpawnCategory;
var LogLevel = SpawnerTypes.LogLevel;
var IPVersion = SpawnerTypes.IPVersion;

/**
For reference, the following Enum values are defined:

- IPVersion values: { Auto, ForceIPv4 }
- LogTimeFormat values: { ISO, Local, Delta };
- LogLevel values: { Error, Warn, Info, Verbose, Debug }

LogSpawnCategory values can be binary or'd together using "|"
- LogSpawnCategory values:  { None, Error, Warn, Info, Debug, All }
*/

var config = {
    // The port for the spawn-server REST and proxy calls. Note that setting this to 0 or null will disable the
    // the spawn-server, which may help with troubleshooting.
    spawnServerPort: 11182,

    // The hostname to use for broker-connection stream-cache servers or when enabling SSL. 
    // This field can be used to generate endpoints containing a public DNS or IP address.
    // If not specified, the system will attempt to determine an appropriate value.
    // This value has no effect when using proxying unless SSL is enabled. 
    // When SSL is enabled, this hostname must be verifiable against the supplied 
    // certificate chain. 
    publicHostname: null,

    // Determine if the servers use a mix of IPv4 and IPv6, or force to all IPv4
    // IPVersion values: { Auto, ForceIPv4 }
    ipVersion: IPVersion.Auto,

    ////////////////////////////////////////////////////////////////////////////////
    // The following values control SSL settings 
    ////////////////////////////////////////////////////////////////////////////////

    // Determines the full-chain SSL certificate file. This must be set when enabling any 
    // component for SSL. 
    sslCertificateFile: null, 
    
    // Determines the SSL private-key file. This must be set when enabling any component for SSL. 
    sslPrivateKeyFile: null, 
    
    // Determines if SSL is enabled for the file-server. 
    sslEnableFileServer: false,
    
    // Determines if SSL is enabled for the spawn-server. 
    sslEnableSpawnServer: false,
    
    // Determines if SSL is enabled for the spawned stream-cache servers. 
    sslEnableScServer: false,

    ////////////////////////////////////////////////////////////////////////////////
    // The following values control the ports used by the spawned stream-cache servers.  Each server requires a
    // port for websocket communication with the hoops web-viewer.

    // Maximum number of simultaneous spawns
    spawnMaxSpawnCount: 32,

    // First websocket port. The range of used Websocket ports will therefore be:
    //   [spawnWebsocketPortsBegin, (spawnWebsocketPortsBegin + spawnMaxSpawnCount - 1)]
    spawnWebsocketPortsBegin: 11000,
    
    ////////////////////////////////////////////////////////////////////////////////
    // Liveliness settings for spawned stream-cache servers.

    // Frequency at which each spawned stream-cache servers will report its liveliness status with the server (in seconds).
    // The spawn-server will kill any stream-cache server that hasn't reported within (3*spawnLivelinessReportIntervalTime).
    spawnLivelinessReportIntervalTime: 5,

    // If a stream-cache server does not hear from the HWV within this many seconds after the being spawned, it will exit
    spawnInitialUseDuration: 60,

    ////////////////////////////////////////////////////////////////////////////////
    // Misc Settings

    // Determines if client-side rendering requests are allowed
    csrEnabled: true,

    // Determines if server-side rendering requests are allowed
    ssrEnabled: true,

    // Optional parameter to allow use of multiple GPUs in SSR mode. This should be a positive integer indicating the number
    // of available GPUs to use. The general approach is the GPU with the least number of clients will be selected for a
    // new spawn. Alternatively, setting to 'null' will cause the default GPU to be used in all cases.
    ssrGpuCount: null,

    // Optional parameter to have the SSR use EGL for OpenGL context creation.
    // It is recommended to set this value to true for headless server environments.
    // This parameter is currently only supported on Linux.
    ssrUseEgl: false,

    // If set to non-null, this will cause the garbage collection to be run explicitly at the specified interval (in seconds)
    autoGcIntervalTime: 30,
    
    // If set to 'true', the server won't exit on an 'Enter' press in the console, and won't display the associated 
    // message via `console.log()`
    disableConsoleEnterToShutdown: null,

    ////////////////////////////////////////////////////////////////////////////////
    // Spawn-server directory configuration 

    // Points to the root of the communicator package, can be relative or absolute. If it's
    // relative, then it's relative to the root of the server/node directory.
    communicatorDir: "../..",

    // Path to the stream cache server executable. If 'null', then the default exe from the communicator 
    // package is used. If this is a relative path, it will be relative to 'communicatorDir'
    streamCacheExeFile: null,

    // Array of directories that contain the models available to the stream-cache servers.
    // Any relative directories are relative to 'communicatorDir'
    // Note that SCS models are not delivered by the spawn server, thus the paths are not included
    modelDirs: [
        "./quick_start/converted_models/user/sc_models",
        "./quick_start/converted_models/authoring_samples_data",
        "./quick_start/converted_models/standard/sc_models",
    ],

    // A directory that is used for temporary files by the stream-cache servers.
    // If this is a relative path, it will be relative to 'communicatorDir'
    workspaceDir: "~/ts3d_communicator_workspace",

    ////////////////////////////////////////////////////////////////////////////////
    // Logger settings
    ////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////
    // These settings apply to the HOOPS server and spawned sc-servers
    ////////////////////////////////////////////////////////////////////////////////

    // Directory where logs will be written to. If this is a relative path, it will be relative to 'communicatorDir'
    logDir: "~/ts3d_communicator_logs",

    ////////////////////////////////////////////////////////////////////////////////
    // These settings apply only to spawned sc-server logging
    ////////////////////////////////////////////////////////////////////////////////

    // Log Categories to enable for sc-server file-logging. LogSpawnCategory values can be combined
    // using the binary OR operator '|'
    // LogSpawnCategory values:  { None, Error, Warn, Info, Debug, All }
    logSpawnFileCategoryMask: LogSpawnCategory.Info | LogSpawnCategory.Warn | LogSpawnCategory.Error,

    // Log Categories to enable for sc-server stdout-logging. This is typically disabled in favor 
    // of using file logging for the sc-servers. If it is enabled by setting the mask to non-None, then 
    // the stdout for all spawned sc-servers will be captured by the HOOPS server. How those messages 
    // are logged by the HOOPS server is controlled by the 'logStdoutAsLevel' configuration value. 
    // LogSpawnCategory values:  { None, Error, Warn, Info, Debug, All }
    logSpawnStdoutCategoryMask: LogSpawnCategory.None,

    // Determines if sc-server log-file entries use absolute or delta seconds-since-start time.
    logSpawnUseDeltaTime: false,

    ////////////////////////////////////////////////////////////////////////////////
    // These settings apply only to HOOPS server logging
    ////////////////////////////////////////////////////////////////////////////////

    // Determines the time format used for the HOOPS server file logging. 
    // LogTimeFormat values: { ISO, Local, Delta };
    // If undefined or 'null', ISO time will be used
    logFileTimeFormat: LogTimeFormat.ISO,

    // Determines the time format used for the HOOPS server console logging.
    // LogTimeFormat values: { ISO, Local, Delta };
    // If undefined or 'null', Local time will be used
    logConsoleTimeFormat: LogTimeFormat.Local,

    // Controls how stdout messages from spawned sc-servers are logged. If a valid log-level
    // is given, it will be used. If the value is 'null', stdout messages will not be logged.
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logStdoutAsLevel: LogLevel.Debug,

    // Controls how stderr messages from spawned sc-servers are logged. If a valid log-level
    // is given, it will be used. If the value is 'null', stderr messages will not be logged.
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logStderrAsLevel: LogLevel.Debug,

    // Determines the log-level to use for the server's console logging. 'null' will disable console logging.
    // Logged messages at the indicated level and the levels to the left of that level will be logged.
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logConsoleLevelCutoff: LogLevel.Info,

    // Determines the log-level to use for the server's file logging. 'null' will disable file logging.
    // Note that this is the servers log level, which is distinct from the spawned sc-server's file logging
    // controlled by the 'logSpawnFileCategoryMask'.
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logFileLevelCutoff: LogLevel.Verbose,

    // Allows a regular expression to filter out unwanted REST HTTP requests from the log. This should be a
    // Javascript compliant regular expression, or 'null' to allow all messages logged.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
    logRestFilterRegex: /POST.*liveliness=ping/,

    // Determines the log-level used for REST HTTP requests received by the server. 'null' will disable
    // logging those entries entirely.
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logRestHttpRequestsAsLevel: LogLevel.Verbose,

    // Determines the log-level used for file-server HTTP requests received by the server. 'null' will disable
    // logging those entries entirely. This value is unused when the file-server is not enabled
    // LogLevel values: { Error, Warn, Info, Verbose, Debug }
    logFileHttpRequestsAsLevel: LogLevel.Debug,

    ////////////////////////////////////////////////////////////////////////////////
    // The following are configuration values for the optional http file server.  Disable this http server if you
    // are running your own.
    ////////////////////////////////////////////////////////////////////////////////

    // The port used by the http file-server. Set to null or 0 to disable the http server
    fileServerPort: 11180,

    // Static directories used by the http file-server for serving content. Any relative directories are relative to 'communicatorDir'
    // Note that SCS models are delivered by the http server, thus scs paths are in here
    fileServerStaticDirs: [
        "./tutorials/basic_app",
    ],

    // Determines if the file-server will support proxying of direct viewer websocket connections to 
    // the spawn-server. If this is "true" then only the file-server port needs to be made available 
    // in terms of firewall settings
    fileServerProxyViewerConnections: true,

    ////////////////////////////////////////////////////////////////////////////////
    // Windows Service support. These settings are useful when using the HOOPS server as 
    // a windows service. 
    ////////////////////////////////////////////////////////////////////////////////

    // Windows services and associated child processes are executed in what Microsoft calls 
    // "Terminal Services session 0" and thus don't typically have access to the GPU, 
    // which means SSR will not work properly without modification. Setting this value 
    // to 'true' will cause any spawned sc-server to "respawn" itself into the same 
    // terminal session as the winlogon.exe application which *does*  have access to the GPU. 
    //
    // When enabled, this means that a single viewer session will result in two spawned 
    // sc-server processes for the duration of the viewing session. Since the originating 
    // process does nothing more than spawn the second process and forward its stdout, 
    // its CPU and memory usage will be minimal. Also note that the process are linked such 
    // that they will exit together, so there should be no concern about cleaning up extra 
    // processes. 
    //
    // To summarize, enable this setting only when 1) running the HOOPS Server as a Windows 
    // Service and 2) utilizing SSR functionality. 
    //
    // See https://docs.microsoft.com/en-us/windows/win32/services/interactive-services for more information.
    windowsServiceRespawnEnabled: false,

    // When respawning is enabled, this value will control the suffix of the log file name 
    // used for the originating sc-server process. Note that the "respawned" process, ie the one 
    // that does the actual streaming, will use the normal log file name, so this suffix 
    // does not apply to it. To disable log files entirely for the sc-server processes 
    // launched in session 0, set this to the empty string or to null. Typically you'll 
    // only need to set this to a reasonable suffix string like "_respawner" if viewers 
    // aren't working properly when using as a Windows service, thus we default it to 'null'. 
    windowsServiceRespawnLogSuffix: null,

    ////////////////////////////////////////////////////////////////////////////////
    // License specification. Only one of these settings can be non-null
    ////////////////////////////////////////////////////////////////////////////////

    // Path to a license file, unless 'license' is defined, then null
    licenseFile: null,

    // A valid communicator license key, unless 'licenseFile' is defined, then null
license:"4C3axgRk4i224hU30DMHAQNp8UazBDVdvSeK9QN61yQN9SM4fv9MjFn40iFx0yn18yzorCVo8yhFjBn05xqJAxZyDUyG3Sf6wSazDQJuBCy53wF74gZ64UIGBwUMBDZ6xwA4AiM75DN10SIT7Uu3xvYQDfJ7ABR8BvRzzTq6BBVkCTYK2wu37UiHAS280eJk8hVr3DULBRMU7QI63TeLCUnyDTa51wJ3vBeL0DZc0xmCj7DFByeM4rDFj7EZxDRrWslFjCz$wwPGj7DFj7DFjJPOj7DFj7DFWslFjHmPIqQV9i3u0uIX3yny8gYZ9vaWxEVz0hVo8izv9yRs1yuZ4jjq8UiK2iJ$9QJ91BJ25iyQ9U2JBwn4CDmVCSfz9BV05sQYzyYgj7DFDrHFjBeSDVqXxQJa2SUG1hjvwRNt5vVb8gyOzVjq2S3s2FftwfY36jrr1xi_9Tb25imS5yJ72vjmxiM16eJ0BgmZ1ff71Uu03DMY9iM2Egft9hRz4SIZvBm11BaG3ReGBBR43xnu2iI8ATa06gI49wm6CANv3wz6AgMKxwI10w67CSr92EJ94iUJBxIZ1ib73he31zjz2UB$BSRv1CUG9Ez9zSbs5BU1AfR8BFqX4UR44uNrCiYT8eZb2UN50SqP2QUL6eJx0ENd3EfyEfRk7SVpBURaDwv89iqQATM0xCN7CBJ73UIVCVrsvUU1vTaG1jaG8vI4AEZbBfIT2QN9weE59AF3wS608ge8whjnAg1Fj7DFWslFj7DFj7Ehj7DFvBi87RbpxBm4vDU3xQZmxve79eNlxQY3xxRnxbE78fjnvDUz8fa07Rm1wTU6wQQ4xya6wQE8wTI1vQRm8xNmweRnxQU78ya58uUzvEbl8QU38Ri78AQ2xxM38Ua4xhJpwuMz7TI28AY8xDY4wAM78xM8wvm49hQ5wANpvDY4xuI1wfe4weE8vRe3xviz8xY4vQVk9eI7xxU3wffm9hY5vAQ08DI2wxI2wBizxQMzxBe2xAMzxhI58eQ27QVowxU69hRpwAQ1vBm1xTQ79eU0xQU0vTRpwxJlwBm38eE48TI5vTM09eM2wTZlxuM3xDY1vTQ6wxI7xeNp8va88fe0vDM47TNlwDM78Bi1xvm5wEa5xBfkwBezwQNmvAM08uY3wybowARkvDJm8Ea0vTI48hRn8Rnl8Bi7xfa17TQz7TJpvQJnvBi3vDY18AQz7TI7xAI7xhRkvQEzxuM2vRjnxDY8vRa0wQVpxQE1vUazwAUz8fbo8Bi3vDY3xTQ2vANl9hU1xDU3xeVlwvjoxvi2xeJnwNE8EeJd"
};

module.exports = config;
