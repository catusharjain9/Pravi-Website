import unittest
from app.printing.page_range import parse_page_range

class PageRangeTests(unittest.TestCase):
    def test_blank_and_all_mean_every_page(self):
        self.assertIsNone(parse_page_range("", 9))
        self.assertIsNone(parse_page_range(" all ", 9))
        self.assertIsNone(parse_page_range("*", 9))

    def test_single_and_multiple_ranges_preserve_order(self):
        self.assertEqual(parse_page_range("1, 3-5, 8", 9), [0, 2, 3, 4, 7])

    def test_duplicate_pages_are_removed(self):
        self.assertEqual(parse_page_range("1-3, 2, 3-4", 4), [0, 1, 2, 3])

    def test_rejects_zero_reversed_and_out_of_bounds(self):
        for value in ("0", "5-3", "1,0", "1-8"):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    parse_page_range(value, 7)

    def test_rejects_malformed_tokens(self):
        for value in ("1,,3", "one", "1-", "-2", "2;4"):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    parse_page_range(value, 7)

    def test_requires_known_page_count_for_explicit_ranges(self):
        with self.assertRaises(ValueError):
            parse_page_range("1-2", None)

if __name__ == "__main__":
    unittest.main()
