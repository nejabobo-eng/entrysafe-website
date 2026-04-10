// COPY THIS METHOD TO REPLACE _autoPostTransaction in ai_command_center_screen.dart

void _autoPostTransaction(Map<String, dynamic> aiData) {
  final dataRepo = Provider.of<DataRepository>(context, listen: false);
  
  // Extract transaction from nested structure
  final transaction = aiData['transaction'] as Map<String, dynamic>?;
  if (transaction == null) {
    print('⚠️ [Auto-Post] No transaction data found, skipping auto-post');
    return;
  }
  
  final previewId = aiData['preview_id'] ?? const Uuid().v4();

  if (_processedTransactionIds.contains(previewId)) {
    print('⚠️ [Auto-Post] Transaction $previewId already processed');
    return;
  }

  try {
    print('🔵 [Auto-Post] Processing transaction: $previewId');
    
    final String transactionType = transaction['type'] ?? 'expense';
    final String type = transactionType.toLowerCase() == 'income' ? 'Inflow' : 'Outflow';
    final double amount = ((transaction['amount'] ?? 0) as num).toDouble();
    
    final mappedData = {
      'id': previewId,
      'date': transaction['date'] ?? DateTime.now().toIso8601String(),
      'type': type,
      'account': transaction['account'] ?? 'Cash',
      'description': transaction['description'] ?? 'AI Auto-Generated',
      'amount': amount,
      'vatRate': 0.0,
      'isVatInclusive': 0,
      'updatedAt': DateTime.now().toIso8601String(),
      'isDeleted': 0,
    };

    final transactionObj = TransactionData.fromMap(mappedData);
    dataRepo.addTransaction(transactionObj);
    
    _processedTransactionIds.add(previewId);

    print('✅ [Auto-Post] Posted successfully: ${transaction['description']} - R$amount');

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('✅ AI Transaction posted: ${transaction['description']} - R$amount'),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 3),
      ),
    );
  } catch (e) {
    print('❌ [Auto-Post] Error: $e');
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('❌ Failed to post: $e'),
        backgroundColor: Colors.red,
      ),
    );
  }
}