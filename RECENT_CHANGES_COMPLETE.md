# Recent Changes - AI Transaction Staging Area

## Overview
**Recent Changes** is a visible staging area for AI-parsed transactions. It acts as a checkpoint to verify the AI → App data bridge works correctly before transactions flow into registers, reports, and dashboards.

## Purpose
Before this feature, AI transactions were "posting" but invisible - nowhere to verify if the mapping worked. Recent Changes solves this by:
- ✅ Making AI transactions **visible** immediately after parsing
- ✅ Showing journal entry details (debit/credit breakdown)
- ✅ Allowing manual posting to ledger with "Post to Ledger" button
- ✅ Tracking status: Pending → Posted → Failed

## Architecture

### Components

#### 1. `RecentChangesProvider` (`lib/providers/recent_changes_provider.dart`)
```dart
class RecentChangesProvider extends ChangeNotifier {
  List<AITransactionEntry> get entries;
  
  void addAITransaction(AITransactionEntry entry);
  void markAsPosted(String previewId);
  void removeEntry(String previewId);
  void clearAll();
}
```

**Purpose**: Manages staging area state, notifies UI of changes

**Key Classes**:
- `AITransactionEntry`: Single transaction with preview ID, amount, journal lines, status
- `TransactionStatus`: enum (pending, posted, failed)
- `JournalLine`: Debit/credit entry with account

#### 2. `_buildRecentChanges()` Widget (`lib/screens/home_screen.dart`)
Displays last 5 AI transactions on home screen with:
- Transaction type icon (green arrow down = income, red arrow up = expense)
- Amount and description
- Status badge (Posted = green, Pending = orange)
- "Post to Ledger" button for pending entries
- Tap to view full journal entry details
- "Clear All" button

#### 3. AI Command Center Integration (`lib/screens/ai_command_center_screen.dart`)
```dart
Future<void> _autoPostTransaction(AIMessage message) async {
  // Parse AI JSON
  // Create AITransactionEntry
  // Add to RecentChangesProvider
  recentChangesProvider.addAITransaction(entry);
  
  // Show snackbar
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('✅ Posted to Recent Changes')),
  );
}
```

## Data Flow

```
AI Backend (FastAPI)
    ↓ JSON response
AI Command Center
    ↓ Parse & Validate
RecentChangesProvider (Staging)
    ↓ Manual "Post to Ledger" OR Auto-post
DataRepository.addTransaction()
    ↓ Save to SQLite
Registers / Reports / Dashboard
```

## User Journey

### Step 1: Send AI Command
User types: `"add r500 income from services"`

### Step 2: AI Parses to Journal Entry
Backend returns:
```json
{
  "preview_id": "ai_1234567890",
  "transaction": {
    "type": "INCOME",
    "amount": 500,
    "description": "Income from services",
    "journal_lines": [
      {"account": "Cash", "debit": 500, "credit": 0},
      {"account": "Service Revenue", "debit": 0, "credit": 500}
    ]
  }
}
```

### Step 3: Entry Appears in Recent Changes
Home screen shows:
```
┌─────────────────────────────────────┐
│ 🕐 Recent AI Changes        Clear All│
├─────────────────────────────────────┤
│ ↓ Income from services              │
│   R500.00 • Just now                │
│                    [Pending] [Post] │
└─────────────────────────────────────┘
```

### Step 4: Verify Details (Tap Entry)
Dialog shows full journal entry:
```
Income from services
Type: INCOME
Amount: R500.00

Journal Lines:
Cash                Dr: R500.00  Cr: R0.00
Service Revenue     Dr: R0.00    Cr: R500.00

         [Close]  [Post to Ledger]
```

### Step 5: Post to Ledger
Tap "Post to Ledger" →
- Converts `AITransactionEntry` to `TransactionData`
- Saves to SQLite via `dataRepository.addTransaction()`
- Marks as Posted in Recent Changes
- Status changes to green "Posted" badge
- Dashboard/Reports/Registers update automatically (via Provider)

## Implementation Details

### Transaction Conversion
```dart
// AITransactionEntry → TransactionData
TransactionData toTransactionData() {
  String account = journalLines.isNotEmpty 
    ? journalLines.first.account 
    : '';
  
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
}
```

### Time Formatting
Recent Changes shows relative timestamps:
- < 60 seconds: "Just now"
- < 60 minutes: "5m ago"
- < 24 hours: "2h ago"
- ≥ 24 hours: "3d ago"

### Status Tracking
```dart
enum TransactionStatus {
  pending,  // AI parsed, not yet in ledger
  posted,   // Successfully added to database
  failed,   // Error during posting
}
```

## Testing

### Test Sequence
1. **Run app**: `flutter run`
2. **Open AI Command Center** (bottom nav bar)
3. **Send command**: `"add r500 income from services"`
4. **Wait for AI response** (~2-5 seconds)
5. **Navigate to Home Screen**
6. **Verify Recent Changes section appears** with entry
7. **Check details**:
   - ✅ Amount: R500.00
   - ✅ Type: Income (green arrow down)
   - ✅ Status: Pending (orange badge)
   - ✅ Description: "Income from services"
8. **Tap entry** → Verify journal lines show correct debits/credits
9. **Tap "Post to Ledger"** → Status changes to Posted (green)
10. **Check Cash Register** → Verify R500 appears
11. **Check Reports** → Verify transaction included

### Expected Results
✅ AI transactions visible immediately after parsing  
✅ Journal entry details accessible  
✅ Manual posting works  
✅ Status updates correctly  
✅ Dashboard/registers/reports update after posting  

## Benefits

### For Debugging
- **Visibility**: See AI transactions before they hit the ledger
- **Verification**: Confirm account extraction, amounts, journal lines correct
- **Control**: Manual posting lets you test one transaction at a time

### For Users
- **Confidence**: See what AI created before it affects books
- **Transparency**: Full journal entry breakdown available
- **Safety**: Staging area prevents bad data from corrupting ledger

## Future Enhancements

### Phase 1 (Current)
✅ Manual posting from Recent Changes  
✅ Status tracking  
✅ Journal entry details dialog  

### Phase 2 (Next)
- [ ] Auto-post after X seconds (with toggle)
- [ ] Edit transaction before posting
- [ ] Reject/delete bad entries
- [ ] Batch post multiple entries

### Phase 3 (Future)
- [ ] AI confidence score display
- [ ] Suggest corrections
- [ ] Learn from user edits
- [ ] Smart auto-post (only high confidence)

## Code References

**Key Files**:
- `lib/providers/recent_changes_provider.dart` - State management
- `lib/screens/home_screen.dart` - UI display
- `lib/screens/ai_command_center_screen.dart` - AI integration
- `lib/main.dart` - Provider registration

**Database**:
- Schema version: 10
- Table: `transactions`
- Fields: id, date, type, amount, account, description, customerVendor, inventoryItem, quantity

**Backend**:
- API: `POST /api/ai-command`
- Response: `{preview_id, transaction: {type, amount, description, journal_lines}}`

## Troubleshooting

### Entry Not Appearing in Recent Changes
1. Check AI backend is responding (look for "Posted to Recent Changes" snackbar)
2. Verify `RecentChangesProvider` registered in `main.dart`
3. Check `_autoPostTransaction()` is calling `addAITransaction()`

### "Post to Ledger" Button Not Working
1. Check `toTransactionData()` method exists in `AITransactionEntry`
2. Verify `DataRepository` is `ChangeNotifier`
3. Check database schema version is 10 with all required columns

### Status Not Updating
1. Verify `markAsPosted()` is being called
2. Check `notifyListeners()` is in `RecentChangesProvider`
3. Confirm UI is wrapped with `Consumer<RecentChangesProvider>`

## Success Metrics

✅ **Problem**: AI transactions invisible, couldn't verify mapping  
✅ **Solution**: Recent Changes staging area with full visibility  
✅ **Result**: Can now debug and verify AI → App bridge works  

**Before**: "Transaction posted" but nothing in UI  
**After**: Entry appears in Recent Changes, can verify details, manually post to ledger  

---

**Last Updated**: January 2025  
**Status**: ✅ Implemented and Ready for Testing  
**Next Step**: Test AI transaction → Recent Changes → Ledger flow
