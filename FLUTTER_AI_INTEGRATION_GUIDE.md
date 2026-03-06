# 📱 Flutter Integration Guide for AI Transaction Auto-Creation

## Overview
This guide shows how to integrate the FastAPI transaction auto-creation endpoint into your Flutter app for the "Approve & Execute" workflow.

---

## 🔧 Setup

### 1. Add Dependencies (pubspec.yaml)
```yaml
dependencies:
  http: ^1.1.0
  provider: ^6.1.1
  cloud_firestore: ^4.13.3
```

---

## 📦 Data Models

### Create Transaction Models (lib/models/transaction_models.dart)
```dart
import 'package:flutter/foundation.dart';

enum TransactionType {
  income,
  expense;

  String toJson() => name;
  static TransactionType fromJson(String json) => values.byName(json);
}

enum TransactionStatus {
  pending,
  executed,
  rejected;

  String toJson() => name;
  static TransactionStatus fromJson(String json) => values.byName(json);
}

class TransactionData {
  final TransactionType transactionType;
  final double amount;
  final String currency;
  final String date;
  final String description;
  final String? category;
  final List<String> tags;
  final TransactionStatus status;
  final String? userId;
  final String? businessName;
  final String? referenceId;

  TransactionData({
    required this.transactionType,
    required this.amount,
    required this.currency,
    required this.date,
    required this.description,
    this.category,
    this.tags = const [],
    this.status = TransactionStatus.pending,
    this.userId,
    this.businessName,
    this.referenceId,
  });

  factory TransactionData.fromJson(Map<String, dynamic> json) {
    return TransactionData(
      transactionType: TransactionType.fromJson(json['transactionType']),
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'],
      date: json['date'],
      description: json['description'],
      category: json['category'],
      tags: List<String>.from(json['tags'] ?? []),
      status: TransactionStatus.fromJson(json['status']),
      userId: json['userId'],
      businessName: json['businessName'],
      referenceId: json['referenceId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'transactionType': transactionType.toJson(),
      'amount': amount,
      'currency': currency,
      'date': date,
      'description': description,
      'category': category,
      'tags': tags,
      'status': status.toJson(),
      'userId': userId,
      'businessName': businessName,
      'referenceId': referenceId,
    };
  }
}

class AITransactionResponse {
  final String response;
  final TransactionData data;

  AITransactionResponse({
    required this.response,
    required this.data,
  });

  factory AITransactionResponse.fromJson(Map<String, dynamic> json) {
    return AITransactionResponse(
      response: json['response'],
      data: TransactionData.fromJson(json['data']),
    );
  }
}
```

---

## 🌐 API Service

### Create AI Service (lib/services/ai_service.dart)
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import '../models/transaction_models.dart';

class AIService {
  final String baseUrl = 'https://entrysafe-website.onrender.com';
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String> _getAuthToken() async {
    final user = _auth.currentUser;
    if (user == null) throw Exception('User not authenticated');
    return await user.getIdToken() ?? '';
  }

  Future<AITransactionResponse> createTransactionFromPrompt({
    required String prompt,
    required String userId,
    String businessName = '',
    int maxTokens = 500,
    double temperature = 0.3,
  }) async {
    try {
      final token = await _getAuthToken();
      
      final response = await http.post(
        Uri.parse('$baseUrl/api/ai/transaction-autocreate'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'prompt': prompt,
          'userId': userId,
          'businessName': businessName,
          'max_tokens': maxTokens,
          'temperature': temperature,
        }),
      );

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return AITransactionResponse.fromJson(jsonData);
      } else if (response.statusCode == 429) {
        throw Exception('AI query limit exceeded. Upgrade your plan.');
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['detail'] ?? 'Failed to create transaction');
      }
    } catch (e) {
      throw Exception('AI Service Error: $e');
    }
  }
}
```

---

## 🎯 State Management

### Create Pending Transactions Provider (lib/providers/pending_transactions_provider.dart)
```dart
import 'package:flutter/foundation.dart';
import '../models/transaction_models.dart';
import '../services/ai_service.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class PendingTransactionsProvider extends ChangeNotifier {
  final AIService _aiService = AIService();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  List<TransactionData> _pendingTransactions = [];
  bool _isLoading = false;
  String? _error;

  List<TransactionData> get pendingTransactions => _pendingTransactions;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> createTransactionFromVoice(String voiceInput, String userId, String businessName) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _aiService.createTransactionFromPrompt(
        prompt: voiceInput,
        userId: userId,
        businessName: businessName,
      );

      // Add to pending list
      _pendingTransactions.add(response.data);
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> approveTransaction(TransactionData transaction) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Save to Firestore
      await _firestore.collection('transactions').add({
        'transactionType': transaction.transactionType.toJson(),
        'amount': transaction.amount,
        'currency': transaction.currency,
        'date': transaction.date,
        'description': transaction.description,
        'category': transaction.category,
        'tags': transaction.tags,
        'status': 'executed',
        'userId': transaction.userId,
        'businessName': transaction.businessName,
        'executedAt': FieldValue.serverTimestamp(),
      });

      // Remove from pending list
      _pendingTransactions.removeWhere((t) => 
        t.date == transaction.date && 
        t.description == transaction.description
      );
      
      _error = null;
    } catch (e) {
      _error = 'Failed to execute transaction: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void rejectTransaction(TransactionData transaction) {
    _pendingTransactions.removeWhere((t) => 
      t.date == transaction.date && 
      t.description == transaction.description
    );
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
```

---

## 🎨 UI Components

### Pending Transactions Panel (lib/widgets/pending_transactions_panel.dart)
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/pending_transactions_provider.dart';
import '../models/transaction_models.dart';

class PendingTransactionsPanel extends StatelessWidget {
  const PendingTransactionsPanel({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<PendingTransactionsProvider>(
      builder: (context, provider, child) {
        if (provider.pendingTransactions.isEmpty) {
          return const Center(
            child: Text(
              'No pending transactions',
              style: TextStyle(color: Colors.grey),
            ),
          );
        }

        return ListView.builder(
          itemCount: provider.pendingTransactions.length,
          itemBuilder: (context, index) {
            final transaction = provider.pendingTransactions[index];
            return TransactionCard(
              transaction: transaction,
              onApprove: () => provider.approveTransaction(transaction),
              onReject: () => provider.rejectTransaction(transaction),
            );
          },
        );
      },
    );
  }
}

class TransactionCard extends StatelessWidget {
  final TransactionData transaction;
  final VoidCallback onApprove;
  final VoidCallback onReject;

  const TransactionCard({
    Key? key,
    required this.transaction,
    required this.onApprove,
    required this.onReject,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction.transactionType == TransactionType.income;
    
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isIncome ? Colors.green.shade100 : Colors.red.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    isIncome ? 'INCOME' : 'EXPENSE',
                    style: TextStyle(
                      color: isIncome ? Colors.green.shade800 : Colors.red.shade800,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                Text(
                  'R ${transaction.amount.toStringAsFixed(2)}',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: isIncome ? Colors.green.shade700 : Colors.red.shade700,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Description
            Text(
              transaction.description,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
            
            const SizedBox(height: 8),
            
            // Date and Category
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  transaction.date,
                  style: const TextStyle(color: Colors.grey),
                ),
                if (transaction.category != null) ...[
                  const SizedBox(width: 16),
                  const Icon(Icons.category, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    transaction.category!,
                    style: const TextStyle(color: Colors.grey),
                  ),
                ],
              ],
            ),
            
            // Tags
            if (transaction.tags.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: transaction.tags.map((tag) => Chip(
                  label: Text(tag, style: const TextStyle(fontSize: 12)),
                  backgroundColor: Colors.blue.shade50,
                  padding: const EdgeInsets.all(4),
                )).toList(),
              ),
            ],
            
            const SizedBox(height: 16),
            
            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onApprove,
                    icon: const Icon(Icons.check_circle, size: 20),
                    label: const Text('Approve & Execute'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onReject,
                    icon: const Icon(Icons.cancel, size: 20),
                    label: const Text('Reject'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 🎤 Voice Input Integration

### Voice Transaction Screen (lib/screens/voice_transaction_screen.dart)
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../providers/pending_transactions_provider.dart';
import '../widgets/pending_transactions_panel.dart';

class VoiceTransactionScreen extends StatefulWidget {
  const VoiceTransactionScreen({Key? key}) : super(key: key);

  @override
  State<VoiceTransactionScreen> createState() => _VoiceTransactionScreenState();
}

class _VoiceTransactionScreenState extends State<VoiceTransactionScreen> {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  String _voiceInput = '';

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  Future<void> _initSpeech() async {
    await _speech.initialize();
    setState(() {});
  }

  Future<void> _startListening() async {
    setState(() => _isListening = true);
    await _speech.listen(
      onResult: (result) {
        setState(() => _voiceInput = result.recognizedWords);
      },
    );
  }

  Future<void> _stopListening() async {
    await _speech.stop();
    setState(() => _isListening = false);
    
    if (_voiceInput.isNotEmpty) {
      _processVoiceInput();
    }
  }

  Future<void> _processVoiceInput() async {
    final provider = context.read<PendingTransactionsProvider>();
    await provider.createTransactionFromVoice(
      _voiceInput,
      'user123', // Replace with actual user ID
      'My Business', // Replace with actual business name
    );
    
    setState(() => _voiceInput = '');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Voice Transactions'),
      ),
      body: Column(
        children: [
          // Voice Input Section
          Container(
            padding: const EdgeInsets.all(24),
            color: Colors.blue.shade50,
            child: Column(
              children: [
                Text(
                  _isListening ? 'Listening...' : 'Tap to speak',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text(
                  _voiceInput,
                  style: const TextStyle(fontSize: 16, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                FloatingActionButton.large(
                  onPressed: _isListening ? _stopListening : _startListening,
                  backgroundColor: _isListening ? Colors.red : Colors.blue,
                  child: Icon(_isListening ? Icons.stop : Icons.mic, size: 40),
                ),
              ],
            ),
          ),
          
          // Pending Transactions Panel
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'Pending AI Changes',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                Expanded(child: PendingTransactionsPanel()),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

---

## 🔗 Main App Setup

### Register Provider (lib/main.dart)
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/pending_transactions_provider.dart';
import 'screens/voice_transaction_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PendingTransactionsProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Entry Safe Accounting',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const VoiceTransactionScreen(),
    );
  }
}
```

---

## ✅ Testing Checklist

- [ ] Test voice input with various transaction types
- [ ] Verify pending transactions appear in panel
- [ ] Test approve functionality (saves to Firestore)
- [ ] Test reject functionality (removes from list)
- [ ] Test error handling (invalid prompts, network errors)
- [ ] Test tier limit exceeded scenario
- [ ] Verify transaction data matches backend schema
- [ ] Test offline mode (cache pending transactions)

---

## 🚀 Production Tips

1. **Error Handling:** Always wrap API calls in try-catch blocks
2. **Loading States:** Show spinners during AI processing
3. **Offline Support:** Cache pending transactions locally
4. **Validation:** Double-check amounts before executing
5. **User Feedback:** Show confirmation dialogs for approvals
6. **Audit Logs:** Store execution history in Firestore
7. **Rate Limiting:** Respect tier limits (shown in error messages)

---

## 📖 Related Documentation
- `AI_TRANSACTION_AUTOCREATE_SCHEMA.md` - Backend schema specification
- `BACKEND_READY_CANCELLATION_ADDED.md` - Backend setup guide

---

**Last Updated:** 2026-03-05  
**Status:** ✅ Ready for Integration  
**Backend Endpoint:** `POST /api/ai/transaction-autocreate`
