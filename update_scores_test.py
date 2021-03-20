import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
from app import update_scores
import models

KEY_OUTCOME = 'input'
KEY_EXPECTED = 'expected'
PLAYER_X = 'player_x'
PLAYER_O = 'player_o'
X_SCORE = 'x_score'
O_SCORE = 'o_score'


class UpdateScoresTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_OUTCOME: 'X',
                PLAYER_X: 'joe',
                PLAYER_O: 'bob',
                X_SCORE: 100,
                O_SCORE: 100,
                KEY_EXPECTED: [101, 99],
            },
            {
                KEY_OUTCOME: 'O',
                PLAYER_X: 'joe',
                PLAYER_O: 'bob',
                X_SCORE: 100,
                O_SCORE: 100,
                KEY_EXPECTED: [99, 101],
            },
            {
                KEY_OUTCOME: 'tie',
                PLAYER_X: 'joe',
                PLAYER_O: 'bob',
                X_SCORE: 100,
                O_SCORE: 100,
                KEY_EXPECTED: [100, 100],
            },
        ]
        self.failure_test_params = [
            {
                KEY_OUTCOME: 'O',
                PLAYER_X: 'joe',
                PLAYER_O: 'bob',
                X_SCORE: 100,
                O_SCORE: 100,
                KEY_EXPECTED: [100, 100],
            },
        ]

    def mocked_db_session_commit(self):
        pass

    def test_success(self):
        for test in self.success_test_params:
            player_x = models.Gamer(username=test[PLAYER_X],
                                    score=test[X_SCORE])
            player_o = models.Gamer(username=test[PLAYER_O],
                                    score=test[O_SCORE])

            actual_result = update_scores(test[KEY_OUTCOME], player_x,
                                          player_o)
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result[0], expected_result[0])
            self.assertEqual(actual_result[1], expected_result[1])

    def test_failure(self):
        for test in self.failure_test_params:
            player_x = models.Gamer(username=test[PLAYER_X],
                                    score=test[X_SCORE])
            player_o = models.Gamer(username=test[PLAYER_O],
                                    score=test[O_SCORE])

            actual_result = update_scores(test[KEY_OUTCOME], player_x,
                                          player_o)
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(actual_result[0], expected_result[0])
            self.assertNotEqual(actual_result[1], expected_result[1])


if __name__ == '__main__':
    unittest.main()
