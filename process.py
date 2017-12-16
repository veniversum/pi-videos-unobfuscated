import json
import re

# Replacement pattern for marker UUN
marker_pattern = re.compile(r'([0-9]{2})([0-9])([0-9])([0-9])([0-9])([0-9])')
marker_key = r'\6\3\5\1\4\2'
# Replacement pattern for student UUN
student_pattern = re.compile('([0-9]{2})([0-9]{2})([0-9])([0-9]{2})')
student_key = r'\3\2\4\1'

# Deobfuscate the raw json
with open('third-party/idea.ed.ac.uk/PIvideos/PIlog2017.json', "rt") as fin:
    with open('data/PIlog2017_deobfuscated.json', "wt") as fout:
        for l in fin:
            cleaned = l.split(',', 1)
            fout.write(marker_pattern.sub(marker_key, cleaned[0]))
            fout.write(',')
            fout.write(student_pattern.sub(student_key, cleaned[1]))
