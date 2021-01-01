import chess
import math
import random
import sys
from app.helper import evaluate_board_value, evaluate_board_value_printed
from copy import deepcopy


class MoveFinder:
    def __init__(self):
        self.is_maximizing = True
        self.depth_to_calculate = 4
        self.chess = chess
        self.board = chess.Board()

    @property
    def board_dict(self):
        return {field: piece.symbol() for field, piece in self.board.piece_map().items()}

    @property
    def winner(self):
        return self.board.turn if self.board.is_checkmate() else None

    def back_a_move(self):
        self.board.pop()
        self.board.pop()

    def make_move(self, field_from, field_to, promotion=None):
        if promotion:
            move = self.chess.Move(field_from, field_to, promotion)
        else:
            move = self.chess.Move(field_from, field_to)
        self.board.push(move)

    def calculate_minimax_score(self, depth, board, alpha, beta, is_maximizing):
        if depth == 0:
            return evaluate_board_value(board)
        if is_maximizing:
            best_move_score = -9999
            for x in board.legal_moves:
                move = chess.Move.from_uci(str(x))
                board.push(move)
                minimax_score = self.calculate_minimax_score(depth - 1, board, alpha, beta, not is_maximizing)
                best_move_score = max(best_move_score, minimax_score)
                board.pop()
                alpha = max(alpha, best_move_score)
                if beta <= alpha:
                    return best_move_score
            return best_move_score
        else:
            best_move_score = 9999
            for x in board.legal_moves:
                move = chess.Move.from_uci(str(x))
                board.push(move)
                minimax_score = self.calculate_minimax_score(depth - 1, board, alpha, beta, not is_maximizing)
                best_move_score = min(best_move_score, minimax_score)
                board.pop()
                beta = min(beta, best_move_score)
                if beta <= alpha:
                    return best_move_score
            return best_move_score

    def find_computer_move(self):
        board = deepcopy(self.board)
        depth = deepcopy(self.depth_to_calculate)
        best_move_score = -9999
        alpha = -10000
        beta = 10000
        best_move = None
        for x in board.legal_moves:
            move = chess.Move.from_uci(str(x))
            board.push(move)
            minimax_score = self.calculate_minimax_score(depth - 1, board, alpha, beta, not self.is_maximizing)
            value = max(best_move_score, minimax_score)
            print(str(x), value > best_move_score, value, best_move_score, minimax_score)
            if self.winner:
                print("WINNER")
            board.pop()
            if value > best_move_score:
                best_move_score = value
                best_move = move
                print(f"Best score: {best_move_score}")
                print(f"Best move: {best_move}")
        self.board.push(best_move)
        print("BOARD value", evaluate_board_value_printed(self.board))
        return best_move

