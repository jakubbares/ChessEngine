from app import create_app
import flask
from flask import render_template
from flask import request
app = create_app('config')
import re
from app.move_finder import MoveFinder
import json

game = MoveFinder()


@app.route("/")
def test_api():
    return "<h1 style='color:blue'>Hello There!</h1>"

@app.route("/initialize", methods=['GET'])
def initialize_board():
    game = MoveFinder()
    return json.dumps(game.board_dict)

@app.route('/move/hero/from/<int:field_from>/to/<int:field_to>/<int:promotion>', methods=['GET'])
def make_hero_move(field_from, field_to, promotion):
    promotion = "Q" if promotion else None
    game.make_move(field_from, field_to, promotion)
    return json.dumps(game.board_dict)

@app.route('/move/computer', methods=['GET'])
def make_computer_move():
    move = game.find_computer_move()
    return json.dumps(game.board_dict)

@app.route('/move/back', methods=['GET'])
def back_a_move():
    game.back_a_move()
    return json.dumps(game.board_dict)

@app.route('/move/winner', methods=['GET'])
def winner():
    return json.dumps(game.winner)

@app.route('/move/board', methods=['GET'])
def get_board():
    return json.dumps(game.board_dict)

@app.route("/move/legal", methods=['GET'])
def get_legal_moves():
    generator = game.board.legal_moves
    moves = [game.board.uci(move) for move in generator]
    return json.dumps(moves)

if __name__ == '__main__':
    app.run(host=app.config['HOST'],
            port=app.config['PORT'],
            debug=app.config['DEBUG'])
