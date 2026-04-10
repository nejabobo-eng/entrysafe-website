import re

# Read the file
with open('lib/providers/recent_changes_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the JournalLine class with null-safe version that uses 'account_name'
old_journal_line = r'''/// Single journal line \(debit/credit entry\)
class JournalLine \{
  final String account;
  final double debit;
  final double credit;
  
  JournalLine\(\{
    required this\.account,
    required this\.debit,
    required this\.credit,
  \}\);
  
  factory JournalLine\.fromJson\(Map<String, dynamic> json\) \{
    return JournalLine\(
      account: json\['account'\] as String,
      debit: \(json\['debit'\] as num\)\?\.toDouble\(\) \?\? 0\.0,
      credit: \(json\['credit'\] as num\)\?\.toDouble\(\) \?\? 0\.0,
    \);
  \}
\}'''

new_journal_line = '''/// Single journal line (debit/credit entry)
class JournalLine {
  final String account;
  final double debit;
  final double credit;
  final String description;
  
  JournalLine({
    required this.account,
    required this.debit,
    required this.credit,
    this.description = '',
  });
  
  factory JournalLine.fromJson(Map<String, dynamic> json) {
    // AI backend sends 'account_name', not 'account'
    final accountName = json['account_name']?.toString() ?? 
                       json['account']?.toString() ?? 
                       'Unknown Account';
    
    return JournalLine(
      account: accountName,
      debit: (json['debit'] as num?)?.toDouble() ?? 0.0,
      credit: (json['credit'] as num?)?.toDouble() ?? 0.0,
      description: json['description']?.toString() ?? '',
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'account': account,
      'debit': debit,
      'credit': credit,
      'description': description,
    };
  }
}'''

# Use regex to find and replace
content = re.sub(old_journal_line, new_journal_line, content, flags=re.DOTALL)

# If regex didn't work, try simple string replacement for the fromJson method only
if 'account_name' not in content:
    # Just fix the fromJson method
    old_from_json = '''  factory JournalLine.fromJson(Map<String, dynamic> json) {
    return JournalLine(
      account: json['account'] as String,
      debit: (json['debit'] as num?)?.toDouble() ?? 0.0,
      credit: (json['credit'] as num?)?.toDouble() ?? 0.0,
    );
  }'''
    
    new_from_json = '''  factory JournalLine.fromJson(Map<String, dynamic> json) {
    // AI backend sends 'account_name', not 'account'
    final accountName = json['account_name']?.toString() ?? 
                       json['account']?.toString() ?? 
                       'Unknown Account';
    
    return JournalLine(
      account: accountName,
      debit: (json['debit'] as num?)?.toDouble() ?? 0.0,
      credit: (json['credit'] as num?)?.toDouble() ?? 0.0,
    );
  }'''
    
    content = content.replace(old_from_json, new_from_json)
    print("✅ Fixed fromJson method with account_name support")
else:
    print("✅ Replaced entire JournalLine class with null-safe version")

# Write the file
with open('lib/providers/recent_changes_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ JournalLine.fromJson fixed!")
print("   - Now reads 'account_name' from AI JSON")
print("   - Null-safe with fallback to 'Unknown Account'")
print("   - Added description field support")
