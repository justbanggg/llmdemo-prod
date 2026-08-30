from flask import request, jsonify, render_template, redirect, abort
from .config import log
from .workflows import process_ctf_request

QUIZ_IDS = ("laksa", "chicken-rice")


def setup_routes(app):
    """Setup all Flask routes"""
    
    @app.before_request
    def _log_request():
        log.info("%s %s from %s", request.method, request.path, request.remote_addr)

    @app.after_request
    def _log_response(resp):
        log.info("%s %s %s", request.method, request.path, resp.status_code)
        return resp

    @app.route("/")
    def index(): 
        return render_template("index.html")

    @app.route("/game")
    def game_ui():
        return render_template("ctf.html")

    @app.route("/quiz/<quiz_id>")
    @app.route("/quiz/<quiz_id>/<screen>")
    def quiz_ui(quiz_id, screen=None):
        if quiz_id not in QUIZ_IDS:
            abort(404)
        return render_template("quiz.html", quiz_id=quiz_id, screen=screen or "opening")

    @app.route("/menu")
    def menu_ui():
        return redirect("/game")

    @app.route("/ctf")
    def ctf_ui():
        return redirect("/game")

    def _game_api():
        try:
            data = request.get_json(silent=True)
            if data and 'msg' in data:
                msg = data['msg']
            else:
                msg = request.get_data(as_text=True).strip()
        except Exception:
            msg = request.get_data(as_text=True).strip()
        
        result = process_ctf_request(msg)
        
        if isinstance(result, str):
            return jsonify(answer=result, challenge_completed=False)
        else:
            return jsonify(result)

    @app.route("/api/game", methods=["POST"])
    def game_api():
        return _game_api()

    @app.route("/api/ctf", methods=["POST"])
    def ctf_api():
        return _game_api()
