import 'package:flutter/foundation.dart';
import 'ai_logger.dart';

/// Routes transaction approvals to affected registers and reports
/// Determines which screens need to refresh after transaction is posted
class AITransactionRouter {
  
  /// Maps transaction types to affected registers and reports
  static AffectedScreens getAffectedScreens(Map<String, dynamic> transaction) {
    final type = (transaction['transaction_type'] ?? '').toLowerCase();
    final journalLines = transaction['journal_lines'] as List<dynamic>? ?? [];
    
    final Set<String> registers = {};
    final Set<String> reports = {};

    AILogger.logInfo('🧭 Routing transaction type: $type');

    // Determine affected registers based on transaction type
    switch (type) {
      case 'income':
      case 'revenue':
        registers.addAll(['bank_register', 'income_register']);
        reports.addAll(['income_statement', 'trial_balance']);
        break;

      case 'expense':
        registers.addAll(['cash_register', 'expense_register']);
        reports.addAll(['income_statement', 'trial_balance']);
        break;

      case 'asset':
      case 'asset_purchase':
        registers.addAll(['asset_register', 'bank_register']);
        reports.addAll(['balance_sheet', 'trial_balance']);
        break;

      case 'liability':
        registers.addAll(['liability_register', 'bank_register']);
        reports.addAll(['balance_sheet', 'trial_balance']);
        break;

      case 'equity':
        registers.addAll(['equity_register']);
        reports.addAll(['balance_sheet', 'trial_balance']);
        break;

      default:
        // Generic transaction - check journal lines
        registers.addAll(_detectRegistersFromJournalLines(journalLines));
        reports.addAll(['general_ledger', 'trial_balance']);
    }

    AILogger.logRefresh(registers.toList(), reports.toList());

    return AffectedScreens(
      registers: registers.toList(),
      reports: reports.toList(),
    );
  }

  /// Detects which registers are affected by analyzing journal line accounts
  static Set<String> _detectRegistersFromJournalLines(List<dynamic> journalLines) {
    final Set<String> registers = {};

    for (final line in journalLines) {
      if (line is Map<String, dynamic>) {
        final accountName = (line['account_name'] ?? '').toLowerCase();

        if (accountName.contains('bank')) {
          registers.add('bank_register');
        } else if (accountName.contains('cash')) {
          registers.add('cash_register');
        } else if (accountName.contains('receivable') || accountName.contains('debtor')) {
          registers.add('debtors_register');
        } else if (accountName.contains('payable') || accountName.contains('creditor')) {
          registers.add('creditors_register');
        } else if (accountName.contains('inventory') || accountName.contains('stock')) {
          registers.add('inventory_register');
        } else if (accountName.contains('equipment') || accountName.contains('asset')) {
          registers.add('asset_register');
        } else if (accountName.contains('loan') || accountName.contains('liability')) {
          registers.add('liability_register');
        } else if (accountName.contains('vat') || accountName.contains('tax')) {
          registers.add('vat_register');
        } else if (accountName.contains('income') || accountName.contains('revenue') || accountName.contains('sales')) {
          registers.add('income_register');
        } else if (accountName.contains('expense') || accountName.contains('cost')) {
          registers.add('expense_register');
        }
      }
    }

    // Always include general ledger for any transaction
    registers.add('general_ledger');

    return registers;
  }

  /// Notifies all affected providers to refresh their data
  /// Call this after a transaction is successfully approved
  static Future<void> refreshAffectedScreens(
    AffectedScreens screens,
    Function(String) refreshCallback,
  ) async {
    AILogger.logInfo('🔄 Refreshing ${screens.registers.length} registers and ${screens.reports.length} reports');

    // Refresh registers
    for (final register in screens.registers) {
      try {
        await refreshCallback(register);
        AILogger.logInfo('✅ Refreshed: $register');
      } catch (e) {
        AILogger.logError('❌ Failed to refresh $register', e.toString());
      }
    }

    // Refresh reports
    for (final report in screens.reports) {
      try {
        await refreshCallback(report);
        AILogger.logInfo('✅ Refreshed: $report');
      } catch (e) {
        AILogger.logError('❌ Failed to refresh $report', e.toString());
      }
    }
  }

  /// Provides user-friendly message about what was updated
  static String getUpdateMessage(AffectedScreens screens) {
    final registerNames = screens.registers.map((r) => _formatRegisterName(r)).toList();
    
    if (registerNames.isEmpty) {
      return 'Transaction posted successfully!';
    }

    if (registerNames.length == 1) {
      return 'Transaction posted! Updated ${registerNames[0]}.';
    }

    if (registerNames.length == 2) {
      return 'Transaction posted! Updated ${registerNames[0]} and ${registerNames[1]}.';
    }

    final first = registerNames.take(registerNames.length - 1).join(', ');
    final last = registerNames.last;
    return 'Transaction posted! Updated $first, and $last.';
  }

  /// Converts register key to display name
  static String _formatRegisterName(String registerKey) {
    final Map<String, String> displayNames = {
      'bank_register': 'Bank Register',
      'cash_register': 'Cash Register',
      'debtors_register': 'Debtors Register',
      'creditors_register': 'Creditors Register',
      'income_register': 'Income Register',
      'expense_register': 'Expense Register',
      'asset_register': 'Asset Register',
      'liability_register': 'Liability Register',
      'vat_register': 'VAT Register',
      'inventory_register': 'Inventory Register',
      'general_ledger': 'General Ledger',
    };

    return displayNames[registerKey] ?? registerKey;
  }
}

/// Stores which screens are affected by a transaction
class AffectedScreens {
  final List<String> registers;
  final List<String> reports;

  AffectedScreens({
    required this.registers,
    required this.reports,
  });

  bool get isEmpty => registers.isEmpty && reports.isEmpty;
  bool get isNotEmpty => !isEmpty;

  int get totalScreens => registers.length + reports.length;

  @override
  String toString() {
    return 'AffectedScreens(registers: $registers, reports: $reports)';
  }
}
