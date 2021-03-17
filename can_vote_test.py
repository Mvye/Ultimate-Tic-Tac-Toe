import unittest

KEY_INPUT = 'input'
KEY_PLAYERS = 'players'
KEY_VOTED = 'voted'
KEY_EXPECTED = 'expected'

def can_vote(username, players, voted):
    '''can_vote method from app.py altered to not use global variables'''
    if username in players and username not in voted:
        return True
    return False

class CanVoteTestCase(unittest.TestCase):
    def setUp(self):
        self.succes_test_params = [
            {
                KEY_INPUT: 'bob',
                KEY_PLAYERS: ['bob', 'joe'],
                KEY_VOTED: [],
                KEY_EXPECTED: True,
            },
            {
                KEY_INPUT: 'joe',
                KEY_PLAYERS: ['bob', 'joe'],
                KEY_VOTED: ['joe'],
                KEY_EXPECTED: False,
            }
        ]
        self.failure_test_params = [
            {
                KEY_INPUT: 'joe',
                KEY_PLAYERS: ['bob', 'joe'],
                KEY_VOTED: ['joe'],
                KEY_EXPECTED: True,
            }
        ]
    
    def test_can_vote_success(self):
        for test in self.succes_test_params:
            username = test[KEY_INPUT]
            players = test[KEY_PLAYERS]
            voted = test[KEY_VOTED]
            
            actual_result = can_vote(username, players, voted)
            expected_result = test[KEY_EXPECTED]
            
            self.assertEqual(actual_result, expected_result)
        
    def test_can_vote_failure(self):
        for test in self.failure_test_params:
            username = test[KEY_INPUT]
            players = test[KEY_PLAYERS]
            voted = test[KEY_VOTED]
            
            actual_result = can_vote(username, players, voted)
            expected_result = test[KEY_EXPECTED]
            
            self.assertNotEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()
