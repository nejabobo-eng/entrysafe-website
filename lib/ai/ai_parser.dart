import 'package:flutter/foundation.dart';
import 'ai_logger.dart';

/// Validates and parses AI command responses from backend
/// Ensures data integrity before displaying to user
class AIParser {
  /// Validates that backend response has all required fields
  static ValidationResult validateResponse(Map<String, dynamic> response) {
    final List<String> errors = [];
    final List<String> warnings = [];

    AILogger.logInfo('🔍 Validating AI response...');

    // Check status field
    if (!response.containsKey('status')) {
      errors.add('Response missing status field');
    } else if (response['status'] != 'success' && response['status'] != 'preview') {
      warnings.add('Unexpected status: ${response['status']}');
    }

    // Check transaction data
    if (!response.containsKey('transaction')) {
      errors.add('Response missing transaction data');
    } else {
      final transaction = response['transaction'] as Map<String, dynamic>?;
      if (transaction != null) {
        final txErrors = _validateTransaction(transaction);
        errors.addAll(txErrors);
      }
    }

    // Check preview_id
    if (response['status'] == 'preview' && !response.containsKey('preview_id')) {
      errors.add('Preview response missing preview_id');
    }

    final isValid = errors.isEmpty;
    
    if (isValid) {
      AILogger.logInfo('✅ Response validation passed');
    } else {
      AILogger.logError('❌ Response validation failed', errors.join(', '));
    }

    return ValidationResult(
      isValid: isValid,
      errors: errors,
      warnings: warnings,
    );
  }

  /// Validates transaction structure
  static List<String> _validateTransaction(Map<String, dynamic> transaction) {
    final List<String> errors = [];

    // Required fields
    final requiredFields = [
      'transaction_type',
      'amount',
      'description',
      'date',
      'journal_lines'
    ];

    for (final field in requiredFields) {
      if (!transaction.containsKey(field)) {
        errors.add('Transaction missing field: $field');
      }
    }

    // Validate amount
    if (transaction.containsKey('amount')) {
      final amount = transaction['amount'];
      if (amount is! num || amount <= 0) {
        errors.add('Invalid amount: $amount');
      }
    }

    // Validate journal lines
    if (transaction.containsKey('journal_lines')) {
      final journalLines = transaction['journal_lines'] as List<dynamic>?;
      
      if (journalLines == null || journalLines.isEmpty) {
        errors.add('Journal lines cannot be empty');
      } else if (journalLines.length < 2) {
        errors.add('Journal entry must have at least 2 lines (debit and credit)');
      } else {
        // Validate double-entry balance
        final balanceErrors = _validateDoubleEntry(journalLines);
        errors.addAll(balanceErrors);
      }
    }

    // Validate date format
    if (transaction.containsKey('date')) {
      try {
        DateTime.parse(transaction['date']);
      } catch (e) {
        errors.add('Invalid date format: ${transaction['date']}');
      }
    }

    return errors;
  }

  /// Validates that debits equal credits (double-entry accounting rule)
  static List<String> _validateDoubleEntry(List<dynamic> journalLines) {
    final List<String> errors = [];

    double totalDebit = 0;
    double totalCredit = 0;

    for (final line in journalLines) {
      if (line is Map<String, dynamic>) {
        // Validate line structure
        if (!line.containsKey('account_name')) {
          errors.add('Journal line missing account_name');
        }
        if (!line.containsKey('debit')) {
          errors.add('Journal line missing debit field');
        }
        if (!line.containsKey('credit')) {
          errors.add('Journal line missing credit field');
        }

        // Sum debits and credits
        final debit = (line['debit'] ?? 0).toDouble();
        final credit = (line['credit'] ?? 0).toDouble();

        totalDebit += debit;
        totalCredit += credit;

        // Validate that line doesn't have both debit and credit
        if (debit > 0 && credit > 0) {
          errors.add('Journal line cannot have both debit and credit: ${line['account_name']}');
        }
      }
    }

    // Check balance (allow 0.01 tolerance for floating point)
    final difference = (totalDebit - totalCredit).abs();
    if (difference > 0.01) {
      errors.add('Journal entry not balanced: Debits=$totalDebit, Credits=$totalCredit');
    }

    return errors;
  }

  /// Extracts user-friendly transaction summary for display
  static TransactionSummary summarizeTransaction(Map<String, dynamic> transaction) {
    final type = transaction['transaction_type'] ?? 'unknown';
    final amount = transaction['amount'] ?? 0;
    final currency = transaction['currency'] ?? 'ZAR';
    final description = transaction['description'] ?? 'No description';
    final date = transaction['date'] ?? DateTime.now().toIso8601String();

    final journalLines = (transaction['journal_lines'] as List<dynamic>?)
        ?.map((line) => JournalLineSummary(
              account: line['account_name'] ?? 'Unknown',
              debit: (line['debit'] ?? 0).toDouble(),
              credit: (line['credit'] ?? 0).toDouble(),
              description: line['description'] ?? '',
            ))
        .toList() ??
        [];

    return TransactionSummary(
      type: type,
      amount: amount.toDouble(),
      currency: currency,
      description: description,
      date: date,
      journalLines: journalLines,
    );
  }
}

/// Result of response validation
class ValidationResult {
  final bool isValid;
  final List<String> errors;
  final List<String> warnings;

  ValidationResult({
    required this.isValid,
    required this.errors,
    required this.warnings,
  });

  bool get hasWarnings => warnings.isNotEmpty;
}

/// Transaction summary for UI display
class TransactionSummary {
  final String type;
  final double amount;
  final String currency;
  final String description;
  final String date;
  final List<JournalLineSummary> journalLines;

  TransactionSummary({
    required this.type,
    required this.amount,
    required this.currency,
    required this.description,
    required this.date,
    required this.journalLines,
  });

  String get formattedAmount => '$currency ${amount.toStringAsFixed(2)}';
  
  String get typeIcon {
    switch (type.toLowerCase()) {
      case 'income':
        return '💰';
      case 'expense':
        return '💸';
      case 'asset':
        return '🏢';
      case 'liability':
        return '📋';
      default:
        return '📊';
    }
  }
}

/// Journal line summary for display
class JournalLineSummary {
  final String account;
  final double debit;
  final double credit;
  final String description;

  JournalLineSummary({
    required this.account,
    required this.debit,
    required this.credit,
    required this.description,
  });

  bool get isDebit => debit > 0;
  bool get isCredit => credit > 0;
  double get amount => isDebit ? debit : credit;
}
