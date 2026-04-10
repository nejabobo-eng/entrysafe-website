content = open('lib/providers/recent_changes_provider.dart', 'r', encoding='utf-8').read()

# Fix the toTransactionData method to include updatedAt
old_return = '''return TransactionData(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: timestamp,
      type: type.toUpperCase(),
      amount: amount,
      account: account,
      description: description,
      customerVendor: '',
      inventoryItem: '',
      quantity: 0,
    );'''

new_return = '''return TransactionData(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      date: timestamp,
      type: type.toUpperCase(),
      amount: amount,
      account: account,
      description: description,
      customerVendor: '',
      inventoryItem: '',
      quantity: 0,
      updatedAt: DateTime.now(),
    );'''

content = content.replace(old_return, new_return)
open('lib/providers/recent_changes_provider.dart', 'w', encoding='utf-8').write(content)
print('✅ Added updatedAt parameter to toTransactionData()')
