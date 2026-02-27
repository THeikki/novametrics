import unittest
from main import generate_sensordata

class TestSensorData(unittest.TestCase):
    def test_data_format(self):
        data = generate_sensordata()
        self.assertIn('lampotila', data)
        self.assertIn('aikaleima', data)
        self.assertIsInstance(data['lampotila'], float)
        self.assertEqual(len(data['aikaleima']), 8)

if __name__ == '__main__':
    unittest.main()