import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-post-login-dummy',
  template: `
    <div style="min-height:100vh;display:grid;place-items:center;background:#1f1f1f;color:#eaeaea">
      <div>
        <h1 style="margin:0 0 8px">Logged in ✅</h1>
        <p>Dashboard coming next. Use the browser back button to test guard.</p>
      </div>
    </div>
  `,
})
export class PostLoginDummyComponent {}
