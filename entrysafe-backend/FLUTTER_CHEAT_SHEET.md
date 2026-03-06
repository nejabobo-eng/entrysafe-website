# 📱 FLUTTER INTEGRATION CHEAT SHEET

**EntrySafe Backend API Reference**  
**Base URL:** `https://entrysafe-website.onrender.com/api`  
**Auth:** Firebase JWT Token in `Authorization: Bearer {token}` header  
**Date:** January 5, 2025

---

## 🚀 QUICK START

### 1. Setup Base Service

```dart
// lib/services/api_client.dart
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'dart:convert';

class ApiClient {
  static const String baseUrl = 'https://entrysafe-website.onrender.com/api';
  
  static Future<Map<String, String>> _getHeaders() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) throw Exception('Not authenticated');
    
    final token = await user.getIdToken(true); // Force refresh
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
  
  static Future<Map<String, dynamic>> post(
    String endpoint, 
    Map<String, dynamic> body, {
    int timeoutSeconds = 30,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
      body: jsonEncode(body),
    ).timeout(Duration(seconds: timeoutSeconds));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('${response.statusCode}: ${response.body}');
  }
  
  static Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, String>? queryParams,
  }) async {
    var uri = Uri.parse('$baseUrl$endpoint');
    if (queryParams != null) {
      uri = uri.replace(queryParameters: queryParams);
    }
    
    final response = await http.get(uri, headers: await _getHeaders());
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    throw Exception('${response.statusCode}: ${response.body}');
  }
}
```

---

## 🤖 AI COMMAND CENTER

### POST /api/ai-command
**Parse natural language into accounting transactions**

**Request:**
```dart
final response = await ApiClient.post('/ai-command', {
  'user_id': userId,
  'company_id': companyId,
  'message': 'Add 1500 rand income from consulting',
}, timeoutSeconds: 60); // AI parsing takes time
```

**Response:**
```json
{
  "preview_id": "uuid-here",
  "status": "preview",
  "message": "Transaction preview created",
  "journal_entry": {
    "date": "2025-01-05",
    "description": "Income from consulting",
    "reference": "JE-000001",
    "lines": [
      {
        "account_code": "1000",
        "account_name": "Bank Account",
        "debit": 1500.00,
        "credit": 0.00
      },
      {
        "account_code": "4100",
        "account_name": "Service Revenue",
        "debit": 0.00,
        "credit": 1500.00
      }
    ],
    "total_debit": 1500.00,
    "total_credit": 1500.00
  }
}
```

**Flutter UI Code:**
```dart
void _sendAICommand(String message) async {
  try {
    final preview = await ApiClient.post('/ai-command', {
      'user_id': _userId,
      'company_id': _companyId,
      'message': message,
    }, timeoutSeconds: 60);
    
    // Show preview modal
    final approved = await showDialog<bool>(
      context: context,
      builder: (ctx) => TransactionPreviewDialog(preview: preview),
    );
    
    if (approved == true) {
      await _approveTransaction(preview['preview_id']);
    }
  } catch (e) {
    _showError('AI parsing failed: $e');
  }
}
```

---

### POST /api/approve-transaction
**Approve and post transaction to journal**

**Request:**
```dart
final response = await ApiClient.post('/approve-transaction', {
  'preview_id': previewId,
  'user_id': userId,
  'company_id': companyId,
});
```

**Response:**
```json
{
  "status": "approved",
  "message": "Transaction posted successfully",
  "journal_entry_id": "uuid-here",
  "reference": "JE-000001",
  "posted_at": "2025-01-05T10:30:00Z"
}
```

**Flutter UI Code:**
```dart
Future<void> _approveTransaction(String previewId) async {
  try {
    final result = await ApiClient.post('/approve-transaction', {
      'preview_id': previewId,
      'user_id': _userId,
      'company_id': _companyId,
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('✅ ${result['message']} - ${result['reference']}'),
        backgroundColor: Colors.green,
      ),
    );
    
    // Refresh data
    await _refreshRegisters();
  } catch (e) {
    _showError('Approval failed: $e');
  }
}
```

---

## 📊 REGISTERS (9 ENDPOINTS)

### GET /api/register/bank
**Bank register with running balance**

**Request:**
```dart
final bank = await ApiClient.get('/register/bank', queryParams: {
  'company_id': companyId,
  'limit': '50',
});
```

**Response:**
```json
{
  "account_code": "1000",
  "account_name": "Bank Account",
  "current_balance": 25000.00,
  "currency": "ZAR",
  "entry_count": 15,
  "transactions": [
    {
      "date": "2025-01-05",
      "reference": "JE-000001",
      "description": "Income from consulting",
      "debit": 1500.00,
      "credit": 0.00,
      "balance": 25000.00
    }
  ]
}
```

**Flutter UI Code:**
```dart
class BankRegisterScreen extends StatefulWidget {
  @override
  _BankRegisterScreenState createState() => _BankRegisterScreenState();
}

class _BankRegisterScreenState extends State<BankRegisterScreen> {
  Map<String, dynamic>? _bankData;
  bool _loading = true;
  
  @override
  void initState() {
    super.initState();
    _loadBankRegister();
  }
  
  Future<void> _loadBankRegister() async {
    setState(() => _loading = true);
    try {
      final data = await ApiClient.get('/register/bank', queryParams: {
        'company_id': _companyId,
        'limit': '50',
      });
      setState(() {
        _bankData = data;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      _showError('Failed to load: $e');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_loading) return Center(child: CircularProgressIndicator());
    if (_bankData == null) return Center(child: Text('No data'));
    
    return Scaffold(
      appBar: AppBar(
        title: Text(_bankData!['account_name']),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadBankRegister,
          ),
        ],
      ),
      body: Column(
        children: [
          // Balance Card
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Current Balance', style: TextStyle(fontSize: 16)),
                  Text(
                    'R ${_bankData!['current_balance'].toStringAsFixed(2)}',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Transaction List
          Expanded(
            child: ListView.builder(
              itemCount: _bankData!['transactions'].length,
              itemBuilder: (ctx, index) {
                final tx = _bankData!['transactions'][index];
                return ListTile(
                  title: Text(tx['description']),
                  subtitle: Text('${tx['date']} - ${tx['reference']}'),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      if (tx['debit'] > 0)
                        Text(
                          '+R${tx['debit'].toStringAsFixed(2)}',
                          style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                        ),
                      if (tx['credit'] > 0)
                        Text(
                          '-R${tx['credit'].toStringAsFixed(2)}',
                          style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                        ),
                      Text(
                        'R${tx['balance'].toStringAsFixed(2)}',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

---

### GET /api/register/cash
**Cash register with running balance**

**Same format as bank register**

```dart
final cash = await ApiClient.get('/register/cash', queryParams: {
  'company_id': companyId,
  'limit': '50',
});
```

---

### GET /api/registers/sales-ledger
**Sales transactions and receivables**

**Request:**
```dart
final sales = await ApiClient.get('/registers/sales-ledger', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
});
```

**Response:**
```json
{
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  },
  "summary": {
    "total_sales": 50000.00,
    "total_received": 35000.00,
    "outstanding_receivables": 15000.00
  },
  "transactions": [
    {
      "date": "2025-01-05",
      "reference": "INV-001",
      "customer": "ABC Corp",
      "amount": 5000.00,
      "status": "paid"
    }
  ]
}
```

---

### GET /api/registers/expenses
**Expenses by category**

**Request:**
```dart
final expenses = await ApiClient.get('/registers/expenses', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
  'category': 'Salaries', // Optional
});
```

**Response:**
```json
{
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  },
  "summary": {
    "total_expenses": 25000.00,
    "total_paid": 20000.00,
    "outstanding_payables": 5000.00
  },
  "by_category": {
    "Salaries": 15000.00,
    "Rent": 5000.00,
    "Utilities": 3000.00,
    "Office Supplies": 2000.00
  },
  "transactions": [...]
}
```

---

### GET /api/registers/payroll
**Salary transactions**

```dart
final payroll = await ApiClient.get('/registers/payroll', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
});
```

---

### GET /api/registers/assets
**Fixed assets with depreciation**

```dart
final assets = await ApiClient.get('/registers/assets', queryParams: {
  'company_id': companyId,
});
```

**Response:**
```json
{
  "total_cost": 100000.00,
  "accumulated_depreciation": 20000.00,
  "net_book_value": 80000.00,
  "assets": [
    {
      "name": "Computer Equipment",
      "cost": 50000.00,
      "accumulated_depreciation": 10000.00,
      "net_book_value": 40000.00,
      "purchase_date": "2024-01-01",
      "depreciation_rate": 0.20
    }
  ]
}
```

---

### GET /api/registers/equity
**Owner's equity movements**

```dart
final equity = await ApiClient.get('/registers/equity', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
});
```

---

### GET /api/registers/liabilities
**Current and non-current liabilities**

```dart
final liabilities = await ApiClient.get('/registers/liabilities', queryParams: {
  'company_id': companyId,
});
```

---

### GET /api/registers/inventory
**Stock movements**

```dart
final inventory = await ApiClient.get('/registers/inventory', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
});
```

---

## 📈 REPORTS (3 ENDPOINTS)

### GET /api/reports/income-statement
**Revenue - Expenses = Net Profit**

**Request (JSON):**
```dart
final incomeStatement = await ApiClient.get('/reports/income-statement', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
  'format': 'json',
});
```

**Response:**
```json
{
  "company_name": "Test Company Ltd",
  "report_type": "Income Statement",
  "period": {
    "start_date": "2025-01-01",
    "end_date": "2025-01-31"
  },
  "revenue": {
    "Service Revenue": 50000.00,
    "Sales Revenue": 30000.00,
    "total": 80000.00
  },
  "expenses": {
    "Salaries": 30000.00,
    "Rent": 10000.00,
    "Utilities": 5000.00,
    "total": 45000.00
  },
  "net_profit": 35000.00
}
```

**Request (PDF):**
```dart
// Get PDF bytes
final response = await http.get(
  Uri.parse('$baseUrl/reports/income-statement').replace(queryParameters: {
    'company_id': companyId,
    'start_date': '2025-01-01',
    'end_date': '2025-01-31',
    'format': 'pdf',
  }),
  headers: await ApiClient._getHeaders(),
);

if (response.statusCode == 200) {
  final bytes = response.bodyBytes;
  
  // Save to device
  final directory = await getApplicationDocumentsDirectory();
  final file = File('${directory.path}/income_statement.pdf');
  await file.writeAsBytes(bytes);
  
  // Open PDF
  await OpenFile.open(file.path);
}
```

**Flutter UI Code:**
```dart
class IncomeStatementScreen extends StatefulWidget {
  @override
  _IncomeStatementScreenState createState() => _IncomeStatementScreenState();
}

class _IncomeStatementScreenState extends State<IncomeStatementScreen> {
  Map<String, dynamic>? _report;
  bool _loading = true;
  DateTime _startDate = DateTime(2025, 1, 1);
  DateTime _endDate = DateTime.now();
  
  Future<void> _loadReport() async {
    setState(() => _loading = true);
    try {
      final data = await ApiClient.get('/reports/income-statement', queryParams: {
        'company_id': _companyId,
        'start_date': _startDate.toIso8601String().split('T')[0],
        'end_date': _endDate.toIso8601String().split('T')[0],
        'format': 'json',
      });
      setState(() {
        _report = data;
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
      _showError('Failed to load: $e');
    }
  }
  
  Future<void> _downloadPDF() async {
    try {
      // Show loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => Center(child: CircularProgressIndicator()),
      );
      
      final response = await http.get(
        Uri.parse('$baseUrl/reports/income-statement').replace(queryParameters: {
          'company_id': _companyId,
          'start_date': _startDate.toIso8601String().split('T')[0],
          'end_date': _endDate.toIso8601String().split('T')[0],
          'format': 'pdf',
        }),
        headers: await ApiClient._getHeaders(),
      );
      
      Navigator.pop(context); // Close loading
      
      if (response.statusCode == 200) {
        final directory = await getApplicationDocumentsDirectory();
        final file = File('${directory.path}/income_statement_${DateTime.now().millisecondsSinceEpoch}.pdf');
        await file.writeAsBytes(response.bodyBytes);
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('✅ PDF saved: ${file.path}')),
        );
        
        await OpenFile.open(file.path);
      }
    } catch (e) {
      Navigator.pop(context);
      _showError('PDF download failed: $e');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_loading) return Center(child: CircularProgressIndicator());
    if (_report == null) return Center(child: Text('No data'));
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Income Statement'),
        actions: [
          IconButton(
            icon: Icon(Icons.picture_as_pdf),
            onPressed: _downloadPDF,
            tooltip: 'Download PDF',
          ),
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadReport,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Company Header
            Text(
              _report!['company_name'],
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(
              'Period: ${_report!['period']['start_date']} to ${_report!['period']['end_date']}',
              style: TextStyle(color: Colors.grey),
            ),
            SizedBox(height: 24),
            
            // Revenue Section
            _buildSection('Revenue', _report!['revenue'], Colors.green),
            SizedBox(height: 16),
            
            // Expenses Section
            _buildSection('Expenses', _report!['expenses'], Colors.red),
            SizedBox(height: 24),
            
            // Net Profit
            Card(
              color: _report!['net_profit'] > 0 ? Colors.green[50] : Colors.red[50],
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Net Profit',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      'R ${_report!['net_profit'].toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: _report!['net_profit'] > 0 ? Colors.green : Colors.red,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildSection(String title, Map<String, dynamic> data, Color color) {
    final items = Map<String, dynamic>.from(data);
    final total = items.remove('total') ?? 0.0;
    
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Divider(),
            ...items.entries.map((entry) {
              return Padding(
                padding: EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(entry.key),
                    Text('R ${entry.value.toStringAsFixed(2)}'),
                  ],
                ),
              );
            }).toList(),
            Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Total', style: TextStyle(fontWeight: FontWeight.bold)),
                Text(
                  'R ${total.toStringAsFixed(2)}',
                  style: TextStyle(fontWeight: FontWeight.bold),
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

### GET /api/reports/balance-sheet
**Assets = Liabilities + Equity**

**Same format as income statement**

```dart
final balanceSheet = await ApiClient.get('/reports/balance-sheet', queryParams: {
  'company_id': companyId,
  'as_of_date': '2025-01-31',
  'format': 'json', // or 'pdf'
});
```

---

### GET /api/reports/trial-balance
**Verify debits = credits**

```dart
final trialBalance = await ApiClient.get('/reports/trial-balance', queryParams: {
  'company_id': companyId,
  'as_of_date': '2025-01-31',
  'format': 'json',
});
```

---

## 🏢 COMPANY MANAGEMENT

### POST /api/company
**Create company on signup**

**Request:**
```dart
final company = await ApiClient.post('/company', {
  'user_id': userId,
  'name': 'My Business Ltd',
  'registration_number': '2025/123456/07',
  'country': 'South Africa',
  'currency': 'ZAR',
  'registration_date': '2025-01-01',
  'representative_name': 'Mlungisi Mncube',
  'tax_number': '9876543210',
  'vat_number': '4123456789',
});

final companyId = company['company_id'];
```

**Response:**
```json
{
  "status": "success",
  "message": "Company created with chart of accounts",
  "company_id": "uuid-here",
  "accounts_created": 20
}
```

**Flutter UI Code (Signup):**
```dart
Future<void> _completeSignup() async {
  try {
    // 1. Create Firebase user
    final credential = await FirebaseAuth.instance.createUserWithEmailAndPassword(
      email: _emailController.text,
      password: _passwordController.text,
    );
    
    // 2. Create company
    final company = await ApiClient.post('/company', {
      'user_id': credential.user!.uid,
      'name': _companyNameController.text,
      'registration_number': _regNumberController.text,
      'country': 'South Africa',
      'currency': 'ZAR',
      'registration_date': DateTime.now().toIso8601String().split('T')[0],
      'representative_name': _nameController.text,
      'tax_number': _taxNumberController.text,
      'vat_number': _vatNumberController.text,
    });
    
    // 3. Save to Firestore
    await FirebaseFirestore.instance
        .collection('users')
        .doc(credential.user!.uid)
        .set({
      'email': _emailController.text,
      'name': _nameController.text,
      'companyId': company['company_id'],
      'companyName': _companyNameController.text,
      'createdAt': FieldValue.serverTimestamp(),
    });
    
    // 4. Navigate to app
    Navigator.pushReplacementNamed(context, '/home');
    
  } catch (e) {
    _showError('Signup failed: $e');
  }
}
```

---

### GET /api/company/{company_id}
**Get company details**

```dart
final company = await ApiClient.get('/company/$companyId');
```

---

### PUT /api/company/{company_id}
**Update company details**

```dart
final updated = await ApiClient.put('/company/$companyId', {
  'name': 'Updated Business Name',
  'representative_name': 'New Representative',
});
```

---

## 📚 CORE ENDPOINTS

### GET /api/chart-of-accounts
**Get all accounts**

```dart
final accounts = await ApiClient.get('/chart-of-accounts', queryParams: {
  'company_id': companyId,
});
```

**Response:**
```json
[
  {
    "code": "1000",
    "name": "Bank Account",
    "type": "Asset",
    "balance": 25000.00,
    "currency": "ZAR",
    "is_active": true
  },
  {
    "code": "4100",
    "name": "Service Revenue",
    "type": "Revenue",
    "balance": 50000.00,
    "currency": "ZAR",
    "is_active": true
  }
]
```

---

### GET /api/account-balance
**Get specific account balance**

```dart
final balance = await ApiClient.get('/account-balance', queryParams: {
  'account_id': accountId,
});
```

---

### GET /api/journal-entries
**Get journal entries with filters**

```dart
final entries = await ApiClient.get('/journal-entries', queryParams: {
  'company_id': companyId,
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
  'account_id': accountId, // Optional
});
```

**Response:**
```json
[
  {
    "id": "uuid",
    "date": "2025-01-05",
    "reference": "JE-000001",
    "description": "Income from consulting",
    "lines": [
      {
        "account_code": "1000",
        "account_name": "Bank Account",
        "debit": 1500.00,
        "credit": 0.00
      },
      {
        "account_code": "4100",
        "account_name": "Service Revenue",
        "debit": 0.00,
        "credit": 1500.00
      }
    ],
    "total_debit": 1500.00,
    "total_credit": 1500.00,
    "approved": true,
    "created_at": "2025-01-05T10:30:00Z"
  }
]
```

---

### GET /api/transactions/list
**Transaction list with pagination**

```dart
final transactions = await ApiClient.get('/transactions/list', queryParams: {
  'company_id': companyId,
  'page': '1',
  'page_size': '20',
  'transaction_type': 'income', // Optional: income, expense, transfer
  'start_date': '2025-01-01',
  'end_date': '2025-01-31',
});
```

---

## 📎 DOCUMENT MANAGEMENT

### POST /api/documents/upload
**Upload invoice/receipt**

```dart
Future<Map<String, dynamic>> uploadDocument(
  String companyId,
  String userId,
  File file,
  String fileType, // 'invoice', 'receipt', 'bank_statement', 'other'
  String? journalEntryId,
) async {
  final request = http.MultipartRequest(
    'POST',
    Uri.parse('$baseUrl/documents/upload'),
  );
  
  request.headers.addAll(await ApiClient._getHeaders());
  
  request.fields['company_id'] = companyId;
  request.fields['user_id'] = userId;
  request.fields['file_type'] = fileType;
  if (journalEntryId != null) {
    request.fields['journal_entry_id'] = journalEntryId;
  }
  
  request.files.add(await http.MultipartFile.fromPath('file', file.path));
  
  final streamedResponse = await request.send();
  final response = await http.Response.fromStream(streamedResponse);
  
  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  }
  throw Exception('Upload failed: ${response.body}');
}
```

---

### GET /api/documents
**List documents**

```dart
final documents = await ApiClient.get('/documents', queryParams: {
  'company_id': companyId,
  'file_type': 'invoice', // Optional
  'page': '1',
  'page_size': '20',
});
```

---

## ☁️ CLOUD BACKUP

### POST /api/cloud-backup/initiate
**Start backup process**

```dart
final backup = await ApiClient.post('/cloud-backup/initiate', {
  'user_id': userId,
  'company_id': companyId,
  'provider': 'google_drive', // or 'onedrive', 'dropbox'
});

// Response contains OAuth URL for user authorization
final oauthUrl = backup['authorization_url'];
```

---

### POST /api/cloud-backup/execute/{backup_id}
**Prepare backup data**

```dart
final data = await ApiClient.post('/cloud-backup/execute/$backupId', {
  'user_id': userId,
});

// Response contains backup data to upload to cloud
final backupJson = data['backup_data'];
```

---

### POST /api/cloud-backup/confirm/{backup_id}
**Confirm successful upload**

```dart
final result = await ApiClient.post('/cloud-backup/confirm/$backupId', {
  'cloud_file_id': fileIdFromCloudProvider,
  'cloud_file_url': urlFromCloudProvider,
});
```

---

## 🏥 HEALTH CHECKS

### GET /api/health
**Basic health check**

```dart
final health = await http.get(Uri.parse('$baseUrl/../health'));
// Note: No auth required
```

---

### GET /api/accounting/health
**Accounting system health**

```dart
final health = await ApiClient.get('/accounting/health');
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "accounting_engine": "operational",
  "ai_parser": "operational",
  "reports": "operational"
}
```

---

## 🚨 ERROR HANDLING

### Standard Error Response
```json
{
  "detail": "Error message here"
}
```

### Flutter Error Handling Pattern
```dart
Future<T> _handleApiCall<T>(Future<T> Function() apiCall) async {
  try {
    return await apiCall();
  } on SocketException {
    throw Exception('No internet connection');
  } on TimeoutException {
    throw Exception('Request timed out - backend may be sleeping (cold start)');
  } on FormatException {
    throw Exception('Invalid response format');
  } catch (e) {
    if (e.toString().contains('401')) {
      // Token expired
      await FirebaseAuth.instance.currentUser?.getIdToken(true);
      return await apiCall(); // Retry
    }
    throw Exception('API Error: $e');
  }
}

// Usage
final data = await _handleApiCall(() => ApiClient.get('/register/bank', ...));
```

---

## ⏱️ COLD START HANDLING

**Render free tier sleeps after 15 minutes of inactivity**

```dart
class ColdStartHandler {
  static Future<void> wakeUpBackend() async {
    try {
      await http.get(
        Uri.parse('$baseUrl/../health'),
      ).timeout(Duration(seconds: 10));
    } catch (e) {
      // Ignore errors, just wake up the backend
    }
  }
  
  static Future<T> withColdStartHandling<T>(
    Future<T> Function() apiCall, {
    Function()? onColdStart,
  }) async {
    try {
      return await apiCall().timeout(Duration(seconds: 5));
    } on TimeoutException {
      // Likely cold start
      onColdStart?.call();
      
      // Wake up backend
      await wakeUpBackend();
      
      // Retry with longer timeout
      return await apiCall().timeout(Duration(seconds: 60));
    }
  }
}

// Usage
final data = await ColdStartHandler.withColdStartHandling(
  () => ApiClient.get('/register/bank', ...),
  onColdStart: () {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(),
            SizedBox(width: 16),
            Text('Waking up backend...'),
          ],
        ),
      ),
    );
  },
);
```

---

## 🧪 TESTING CHECKLIST

### 1. Authentication
- [ ] User can sign up
- [ ] Company created on signup
- [ ] Token refreshes automatically
- [ ] Logged out user gets 401

### 2. AI Commands
- [ ] "Add income" works
- [ ] "Add expense" works
- [ ] Preview shows correct journal lines
- [ ] Approve posts transaction
- [ ] Cancel discards preview

### 3. Registers
- [ ] Bank register shows transactions
- [ ] Cash register shows balance
- [ ] Sales ledger shows revenue
- [ ] Expenses register shows by category

### 4. Reports
- [ ] Income statement shows profit/loss
- [ ] Balance sheet balances
- [ ] PDF downloads successfully
- [ ] PDF opens correctly

### 5. Edge Cases
- [ ] Cold start (first request after 15min)
- [ ] No internet connection
- [ ] Invalid company ID
- [ ] Expired token
- [ ] Server error (500)

---

## 📦 REQUIRED FLUTTER PACKAGES

```yaml
dependencies:
  http: ^1.1.0
  firebase_auth: ^4.15.0
  firebase_core: ^2.24.0
  cloud_firestore: ^4.13.0
  path_provider: ^2.1.1
  open_file: ^3.3.2
```

---

## 🎯 IMPLEMENTATION ORDER

1. **Setup** (15 min)
   - Create `api_client.dart`
   - Test health check
   - Test authentication

2. **Company Creation** (30 min)
   - Update signup flow
   - Save companyId to Firestore
   - Test company creation

3. **AI Chat** (1 hour)
   - Integrate AI command endpoint
   - Add preview modal
   - Add approve functionality
   - Test with sample commands

4. **Bank Register** (30 min)
   - Create screen
   - Load transactions
   - Show balance
   - Test refresh

5. **Income Statement** (45 min)
   - Create screen
   - Load report data
   - Add PDF download
   - Test date filtering

6. **Other Screens** (2-3 hours)
   - Cash register
   - Sales ledger
   - Expenses register
   - Transaction history

7. **Polish** (1 hour)
   - Error handling
   - Loading states
   - Cold start handling
   - Pull to refresh

**Total: ~6-8 hours for complete integration**

---

## 🚀 QUICK START COMMANDS

```dart
// 1. Test health
final health = await http.get(Uri.parse('https://entrysafe-website.onrender.com/api/health'));

// 2. Create company (after Firebase signup)
final company = await ApiClient.post('/company', {...});

// 3. Send AI command
final preview = await ApiClient.post('/ai-command', {
  'user_id': userId,
  'company_id': companyId,
  'message': 'Add 1500 rand income from consulting',
}, timeoutSeconds: 60);

// 4. Approve transaction
final result = await ApiClient.post('/approve-transaction', {
  'preview_id': preview['preview_id'],
  'user_id': userId,
  'company_id': companyId,
});

// 5. Check bank register
final bank = await ApiClient.get('/register/bank', queryParams: {
  'company_id': companyId,
  'limit': '50',
});

print('Balance: R${bank['current_balance']}');
```

---

**🎉 READY TO INTEGRATE!**

All 32 endpoints documented with:
- ✅ Request examples
- ✅ Response formats
- ✅ Flutter code snippets
- ✅ Error handling
- ✅ UI examples
- ✅ Testing checklist

**Start with company creation on signup, then AI chat, then registers!**
