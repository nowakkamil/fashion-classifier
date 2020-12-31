from waitress import serve
import web_server

serve(web_server.app, host='0.0.0.0', port=5000, threads=1)
