import re

# Read the file
with open('lib/providers/recent_changes_provider.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import if not exists
if '../models/transaction_data.dart' not in content:
    content = content.replace(
        "import 'package:flutter/foundation.dart';",
        "import 'package:flutter/foundation.dart';\nimport '../models/transaction_data.dart';"
    )
    print("✅ Added TransactionData import")

# Add toTransactionData method if not exists
if 'toTransactionData' not in content:
    method = '''
  
  /// Convert to TransactionData for database insertion
  TransactionData toTransactionData() {
    // Extract account from first journal line based on type
    String account = '';
    if (journalLines.isNotEmpty) {
      account = journalLines.first.account;
    }
    
    return TransactionData(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: timestamp,
      type: type.toUpperCase(),
      amount: amount,
      account: account,
      description: description,
      customerVendor: '',
      inventoryItem: '',
      quantity: 0,
    );
  }'''
    
    # Add before fromAIJson factory
    content = content.replace(
        '  /// Create from AI JSON response\n  factory AITransactionEntry.fromAIJson(Map<String, dynamic> aiData) {',
        method + '\n\n  /// Create from AI JSON response\n  factory AITransactionEntry.fromAIJson(Map<String, dynamic> aiData) {'
    )
    print("✅ Added toTransactionData() method")
else:
    print("ℹ️ Method already exists")

# Write the file
with open('lib/providers/recent_changes_provider.dart', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ RecentChangesProvider updated!")
