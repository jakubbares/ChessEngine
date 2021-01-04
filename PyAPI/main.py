from app import create_app
import flask
from flask import render_template
from flask import request
app = create_app('config')
import re
from app.move_finder import MoveFinder
import json

game = MoveFinder()
games = {'default': game}

@app.route("/")
def test_api():
    return "<h1 style='color:blue'>Hello There!</h1>"

@app.route("/games", methods=['GET'])
def current_games():
    return json.dumps([key for key in games.keys()])

@app.route("/<string:id>/kill", methods=['GET'])
def kill_game(id):
    games.pop(id, None)
    return json.dumps(f"Game {id} killed")

@app.route("/<string:id>/game/get-or-create", methods=['GET'])
def get_or_create_game(id):
    if id in games:
        return json.dumps(games[id].board_data)
    else:
        return initialize_board(id)

@app.route("/<string:id>/restart", methods=['GET'])
def initialize_board(id):
    games[id] = MoveFinder()
    games[id].restart()
    return json.dumps(games[id].board_data)

@app.route('/<string:id>/move/hero/from/<int:field_from>/to/<int:field_to>/<int:promotion>', methods=['GET'])
def make_hero_move(id, field_from, field_to, promotion):
    promotion = "Q" if promotion else None
    games[id].make_move(field_from, field_to, promotion)
    return json.dumps(games[id].board_data)

@app.route('/<string:id>/move/computer', methods=['GET'])
def make_computer_move(id):
    move = games[id].find_computer_move()
    return json.dumps(games[id].board_data)

@app.route('/<string:id>/move/back', methods=['GET'])
def back_a_move(id):
    games[id].back_a_move()
    return json.dumps(games[id].board_data)

@app.route('/<string:id>/settings/depth/<int:depth>', methods=['GET'])
def set_moves_depth(id, depth):
    games[id].depth_to_calculate = depth
    return json.dumps(f"Depth set at {depth}")

@app.route('/<string:id>/settings/depth', methods=['GET'])
def get_moves_depth(id):
    return json.dumps(games[id].depth_to_calculate)

@app.route('/<string:id>/winner', methods=['GET'])
def winner(id):
    return json.dumps(games[id].winner)

@app.route('/<string:id>/board', methods=['GET'])
def get_board(id):
    return json.dumps(games[id].board_data)

@app.route("/<string:id>/move/legal", methods=['GET'])
def get_legal_moves(id):
    generator = games[id].board.legal_moves
    moves = [games[id].board.uci(move) for move in generator]
    return json.dumps(moves)

if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'],
            debug=app.config['DEBUG'])
