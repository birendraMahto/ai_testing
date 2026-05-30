import csv

csv_file = "/Users/birendramahto/Documents/AI2X_Blueprint/ai_testing/API_TestCase_RICE_POT/API_TestCases.csv"
md_file = "/Users/birendramahto/Documents/AI2X_Blueprint/ai_testing/API_TestCase_RICE_POT/API_TestCases.md"

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    rows = list(reader)

with open(md_file, 'w', encoding='utf-8') as f:
    if rows:
        headers = rows[0]
        # Write header
        f.write("| " + " | ".join(headers) + " |\n")
        # Write separator
        f.write("|" + "|".join(["---"] * len(headers)) + "|\n")
        # Write data rows
        for row in rows[1:]:
            f.write("| " + " | ".join(row) + " |\n")

print(f"Successfully converted CSV to Markdown: {md_file}")
