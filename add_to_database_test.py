import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../'))
from app import add_to_database
import models

KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'

INITIAL_USERNAME = 'bob'


class AddToDatabaseTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'joe',
                KEY_EXPECTED: [INITIAL_USERNAME, 'joe'],
            },
            {
                KEY_INPUT: 'thomas wellington',
                KEY_EXPECTED: [INITIAL_USERNAME, 'joe', 'thomas wellington'],
            },
        ]
        self.failure_test_params = [
            {
                KEY_INPUT: ' ',
                KEY_EXPECTED: [INITIAL_USERNAME],
            },
        ]

        initial_gamer = models.Gamer(username=INITIAL_USERNAME, score=100)
        self.initial_DB_mock = [initial_gamer]

    def mocked_db_session_add(self, username):
        self.initial_DB_mock.append(username)

    def mocked_db_session_commit(self):
        pass

    def mocked_gamer_query_all(self):
        return self.initial_DB_mock

    def test_success(self):
        for test in self.success_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit',
                           self.mocked_db_session_commit):
                    with patch('models.Gamer.query') as mocked_query:
                        mocked_query.all = self.mocked_gamer_query_all

                        print(self.initial_DB_mock)
                        actual_result = add_to_database(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(expected_result)
                        print(self.initial_DB_mock)

                        self.assertEqual(len(actual_result),
                                         len(expected_result))

    def test_failure(self):
        for test in self.failure_test_params:
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit',
                           self.mocked_db_session_commit):
                    with patch('models.Gamer.query') as mocked_query:
                        mocked_query.all = self.mocked_gamer_query_all

                        print(self.initial_DB_mock)
                        actual_result = add_to_database(test[KEY_INPUT])
                        print(actual_result)
                        expected_result = test[KEY_EXPECTED]
                        print(expected_result)
                        print(self.initial_DB_mock)

                        self.assertNotEqual(len(actual_result),
                                            len(expected_result))


if __name__ == '__main__':
    unittest.main()
