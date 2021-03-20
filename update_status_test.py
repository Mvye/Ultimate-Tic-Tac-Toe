import unittest

KEY_INPUT = 'input'
KEY_PLAYERS = 'players'
KEY_SPECTATORS = 'voted'
KEY_EXPECTED = 'expected'


def update_status(username, players, spectators):
    '''update_status method from app.py updated to not use global variables'''
    if len(players) < 2:
        players.append(username)
        return [players.index(username), len(players), len(spectators)]
    spectators.append(username)
    return [2, len(players), len(spectators)]


class UpdateStatusTestCase(unittest.TestCase):
    def setUp(self):
        self.succes_test_params = [{
            KEY_INPUT: 'bob',
            KEY_PLAYERS: [],
            KEY_SPECTATORS: [],
            KEY_EXPECTED: [0, 1, 0],
        }, {
            KEY_INPUT: 'thomas',
            KEY_PLAYERS: ['bob', 'joe'],
            KEY_SPECTATORS: [],
            KEY_EXPECTED: [2, 2, 1],
        }]
        self.failure_test_params = [{
            KEY_INPUT: 'thomas',
            KEY_PLAYERS: ['bob', 'joe'],
            KEY_SPECTATORS: [],
            KEY_EXPECTED: [1, 1, 0],
        }]

    def test_update_status_success(self):
        for test in self.succes_test_params:
            username = test[KEY_INPUT]
            players = test[KEY_PLAYERS]
            spectators = test[KEY_SPECTATORS]

            actual_result = update_status(username, players, spectators)
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result[0], expected_result[0])
            self.assertEqual(actual_result[1], expected_result[1])
            self.assertEqual(actual_result[2], expected_result[2])

    def test_update_status_failure(self):
        for test in self.failure_test_params:
            username = test[KEY_INPUT]
            players = test[KEY_PLAYERS]
            spectators = test[KEY_SPECTATORS]

            actual_result = update_status(username, players, spectators)
            expected_result = test[KEY_EXPECTED]

            self.assertNotEqual(actual_result[0], expected_result[0])
            self.assertNotEqual(actual_result[1], expected_result[1])
            self.assertNotEqual(actual_result[2], expected_result[2])


if __name__ == '__main__':
    unittest.main()
