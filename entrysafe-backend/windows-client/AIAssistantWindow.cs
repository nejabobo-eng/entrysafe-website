using System;
using System.Windows;
using System.Windows.Controls;
using EntrySafe.Services;

namespace EntrySafe.Windows.Examples
{
    /// <summary>
    /// Example WPF Window showing how to use the AI service
    /// Can be used in Entry Safe Accounting, Docs, or Pricing apps
    /// </summary>
    public partial class AIAssistantWindow : Window
    {
        private readonly string _appType; // "accounting", "docs", or "pricing"

        public AIAssistantWindow(string appType)
        {
            InitializeComponent();
            _appType = appType;
            Title = $"AI Assistant - {appType.ToUpper()}";
            
            SetupUI();
        }

        private void SetupUI()
        {
            // Main Grid
            var grid = new Grid();
            grid.Margin = new Thickness(20);

            // Row definitions
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            grid.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });

            // Prompt Label
            var promptLabel = new TextBlock
            {
                Text = "Ask AI Assistant:",
                FontWeight = FontWeights.Bold,
                Margin = new Thickness(0, 0, 0, 8)
            };
            Grid.SetRow(promptLabel, 0);
            grid.Children.Add(promptLabel);

            // Prompt TextBox
            var promptTextBox = new TextBox
            {
                Name = "PromptTextBox",
                Height = 80,
                TextWrapping = TextWrapping.Wrap,
                AcceptsReturn = true,
                VerticalScrollBarVisibility = ScrollBarVisibility.Auto,
                Margin = new Thickness(0, 0, 0, 12)
            };
            promptTextBox.Text = GetHintText();
            Grid.SetRow(promptTextBox, 1);
            grid.Children.Add(promptTextBox);

            // Generate Button
            var generateButton = new Button
            {
                Name = "GenerateButton",
                Content = "Generate Response",
                Height = 40,
                FontSize = 14,
                FontWeight = FontWeights.Bold,
                Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(26, 35, 126)), // Navy
                Foreground = System.Windows.Media.Brushes.White,
                Margin = new Thickness(0, 0, 0, 16)
            };
            generateButton.Click += GenerateButton_Click;
            Grid.SetRow(generateButton, 2);
            grid.Children.Add(generateButton);

            // Response TextBox
            var responseTextBox = new TextBox
            {
                Name = "ResponseTextBox",
                IsReadOnly = true,
                TextWrapping = TextWrapping.Wrap,
                VerticalScrollBarVisibility = ScrollBarVisibility.Auto,
                FontSize = 13,
                Padding = new Thickness(12),
                Background = System.Windows.Media.Brushes.WhiteSmoke
            };
            Grid.SetRow(responseTextBox, 3);
            grid.Children.Add(responseTextBox);

            // Set content
            Content = grid;

            // Register named elements
            RegisterName("PromptTextBox", promptTextBox);
            RegisterName("GenerateButton", generateButton);
            RegisterName("ResponseTextBox", responseTextBox);
        }

        private async void GenerateButton_Click(object sender, RoutedEventArgs e)
        {
            var promptTextBox = (TextBox)FindName("PromptTextBox");
            var generateButton = (Button)FindName("GenerateButton");
            var responseTextBox = (TextBox)FindName("ResponseTextBox");

            var prompt = promptTextBox.Text.Trim();

            if (string.IsNullOrEmpty(prompt))
            {
                MessageBox.Show("Please enter a prompt", "Input Required", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                // Disable button and show loading
                generateButton.IsEnabled = false;
                generateButton.Content = "Generating...";
                responseTextBox.Text = "⏳ Generating response...";

                AIResponse response;

                // Call the appropriate endpoint based on app type
                switch (_appType.ToLower())
                {
                    case "accounting":
                        response = await EntrySafeAIService.GenerateAccountingResponseAsync(prompt);
                        break;
                    case "docs":
                        response = await EntrySafeAIService.GenerateDocsResponseAsync(prompt);
                        break;
                    case "pricing":
                        response = await EntrySafeAIService.GeneratePricingResponseAsync(prompt);
                        break;
                    default:
                        throw new Exception("Invalid app type");
                }

                // Display response
                responseTextBox.Text = $"✨ AI Response:\n\n{response.Result}\n\n---\nTokens used: {response.TokensUsed}";
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Failed to generate response:\n{ex.Message}",
                    "Error",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                responseTextBox.Text = $"❌ Error: {ex.Message}";
            }
            finally
            {
                // Re-enable button
                generateButton.IsEnabled = true;
                generateButton.Content = "Generate Response";
            }
        }

        private string GetHintText()
        {
            return _appType.ToLower() switch
            {
                "accounting" => "e.g., \"Analyze my monthly expenses\" or \"Generate invoice for web services\"",
                "docs" => "e.g., \"Summarize this document\" or \"Suggest tags for this file\"",
                "pricing" => "e.g., \"Suggest pricing for consulting service\" or \"Calculate profit margin\"",
                _ => "Ask me anything..."
            };
        }
    }
}

/* 
 * EXAMPLE USAGE IN YOUR WINDOWS APP:
 * 
 * // For Entry Safe Accounting App
 * var accountingAI = new AIAssistantWindow("accounting");
 * accountingAI.ShowDialog();
 * 
 * // For Entry Safe Docs App
 * var docsAI = new AIAssistantWindow("docs");
 * docsAI.ShowDialog();
 * 
 * // For Entry Safe Pricing App
 * var pricingAI = new AIAssistantWindow("pricing");
 * pricingAI.ShowDialog();
 */
