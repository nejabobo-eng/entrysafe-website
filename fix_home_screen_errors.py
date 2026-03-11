import re

# Read the file
with open('lib/screens/home_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: recentEntries -> entries
content = content.replace('recentChanges.recentEntries', 'recentChanges.entries')
print("✅ Fixed property name: recentEntries -> entries")

# Fix 2: Status comparisons with enum
content = content.replace("entry.status == 'posted'", "entry.status == TransactionStatus.posted")
content = content.replace("entry.status == 'pending'", "entry.status == TransactionStatus.pending")
print("✅ Fixed status comparisons to use TransactionStatus enum")

# Fix 3: Journal line access - map to object properties
content = content.replace("line['account'] ?? 'Unknown'", "line.account")
content = content.replace("(line['debit'] ?? 0)", "line.debit")
content = content.replace("(line['credit'] ?? 0)", "line.credit")
print("✅ Fixed journal line access to use object properties")

# Fix 4: Remove .toList() from spread (unnecessary_to_list_in_spreads warning)
content = re.sub(r'\.\.\.entry\.journalLines\.map\((.*?)\)\.toList\(\)', r'...entry.journalLines.map(\1)', content, flags=re.DOTALL)
print("✅ Removed unnecessary toList() from spread")

# Write the file
with open('lib/screens/home_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Home screen fixes applied!")
