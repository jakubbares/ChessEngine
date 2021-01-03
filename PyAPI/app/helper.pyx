
def get_piece_value(str piece):
    if piece == "P" or piece == "p":
        return 10
    elif piece == "N" or piece == "n":
        return 30
    elif piece == "B" or piece == "b":
        return 30
    elif piece == "R" or piece == "r":
        return 50
    elif piece == "Q" or piece == "q":
        return 90
    elif piece == 'K' or piece == 'k':
        return 900
    else:
        return 0

def evaluate_board_value(board, computer_is_white=False):
   cdef int total_sum = 0
   cdef int index, piece_value

   for index in range(0, 64):
       piece = board.piece_at(index)
       if piece:
           is_white_piece = bool(piece.color)
           color_is_computer = is_white_piece if computer_is_white else not is_white_piece
           piece_value = get_piece_value(piece.symbol()) if piece else 0
           piece_value = piece_value if piece_value else 0
           total_sum += piece_value if color_is_computer else -piece_value
   return total_sum
