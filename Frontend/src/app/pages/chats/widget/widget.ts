import { Component } from '@angular/core';

@Component({
  selector: 'app-widget',
  imports: [],
  templateUrl: './widget.html',
  styleUrl: './widget.css'
})
export class Widget {
  widgetCode: string = `
<script src="https://cdn.chatsaas.ai/widget.js"></script>
<script>
  ChatSaaSWidget.init({
    businessId: "BUSINESS_ID",
    theme: "dark"
  });
</script>
  `;

  copyCode() {
    navigator.clipboard.writeText(this.widgetCode);
    alert('✅ Embed code copied to clipboard!');
  }
}
