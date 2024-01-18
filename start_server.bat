:: Script is relative to this directory 
@cd "%~dp0"

@set node_install_dir=%~dp0\..\..\3rd_party\node

:: Must start the server from the node dir 
@cd ../../server/node

:: Perform the node command directly here to pass in the quick-start config and not the server/node config 
@call "%node_install_dir%\node.exe" --expose-gc ./lib/Startup.js --config-file ../../tutorials/basic_app/server_config.js
