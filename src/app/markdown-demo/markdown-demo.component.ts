import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

import { MarkdownService } from '../markdown/markdown.service';

// tslint:disable:max-line-length
@Component({
  selector: 'markdown-demo',
  templateUrl: './markdown-demo.component.html',
  styleUrls: ['./markdown-demo.component.scss'],
})
export class MarkdownDemoComponent implements OnInit {
  //#region markdown
  blockquotes = require('raw-loader!./markdown/blockquotes.md');
  codeAndSynthaxHighlighting = require('raw-loader!./markdown/code-and-synthax-highlighting.md');
  emphasis = require('raw-loader!./markdown/emphasis.md');
  headers = require('raw-loader!./markdown/headers.md');
  horizontalRule = require('raw-loader!./markdown/horizontal-rule.md');
  images = require('raw-loader!./markdown/images.md');
  links = require('raw-loader!./markdown/links.md');
  lists = require('raw-loader!./markdown/lists.md');
  listsDot = require('raw-loader!./markdown/lists-dot.md');
  tables = require('raw-loader!./markdown/tables.md');
  //#endregion

  //#region remote
  demoPython = require('raw-loader!./remote/demo.py');
  languagePipe = require('raw-loader!./remote/language-pipe.html');
  //#endregion

  //#region variable-binding
  markdown =
`### Markdown example
---
This is an **example** where we bind a variable to the \`markdown\` component that is also bind to a textarea.

#### example.component.ts
\`\`\`typescript
public markdown = "# Markdown";
\`\`\`

#### example.component.html
\`\`\`html
<textarea [(ngModel)]="markdown"></textarea>
<markdown [data]="markdown"></markdown>
\`\`\``;
  //#endregion

  //#region pipe
  pipeMarkdown =
`### Markdown example
---
This is an **example** where we use a variable with the \`markdown\` pipe that is also bind to a textarea. Using the pipe allows to chain pipe transformation.

#### example.component.ts
\`\`\`typescript
public pipeMarkdown = "# Markdown";
\`\`\`

#### example.component.html
\`\`\`html
<textarea [(ngModel)]="pipeMarkdown"></textarea>
<div [innerHTML]="pipeMarkdown | markdown"></div>
\`\`\``;
  typescriptMarkdown =
`import { Component } from '@angular/core';

@Component({
  selector: 'markdown-demo',
  templateUrl: './markdown-demo.component.html',
  styleUrls: ['./markdown-demo.component.scss'],
})
export class MarkdownDemoComponent {
  public pipeMarkdown = '# Markdown';
}`;
  //#endregion

  protected _titleIsAnimating = false;
  protected _pushpinIsOn = false;

  @HostListener('window:resize')
  onWindowResize() {
    this.initPushpin();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.animateTitle();
    this.animateScrollTop();
  }

  constructor(
    private markdownService: MarkdownService,
  ) { }

  ngOnInit() {
    this.initMarkdown();
    this.initPushpin();
    this.initScrollSpy();
  }

  onPageUp() {
    $('html, body').animate({ scrollTop: 0 }, {
      duration: 400,
      queue: false,
      easing: 'easeOutCubic',
    });
  }

  private animateScrollTop() {
    const scrollTop = $('.fixed-action-btn button');
    const windowOffset = window.pageYOffset;
    const hasScaleInClass = scrollTop.hasClass('scale-in');
    const targetScaleInClass = windowOffset > 100 ? true : false;
    // scale-in
    if (!hasScaleInClass && targetScaleInClass) {
      scrollTop.addClass('scale-in');
      Observable.of(null)
        .do(() => scrollTop.addClass('pulse'))
        .delay(1000)
        .do(() => scrollTop.removeClass('pulse'))
        .first()
        .subscribe();
    }
    // scale-out
    if (hasScaleInClass && !targetScaleInClass) {
      scrollTop.removeClass('scale-in');
    }
  }

  private animateTitle() {
    const title = $('.title a');
    const titleOffset = title[0].offsetTop;
    const windowOffset = window.pageYOffset;
    const currentFontSize = title[0].style.fontSize;
    const targetFontSize = windowOffset > titleOffset ? '2.28rem' : '2.92rem';

    if (currentFontSize !== targetFontSize && !this._titleIsAnimating) {
      title.animate({ fontSize: targetFontSize}, {
        duration: 200,
        queue: false,
        easing: 'easeOutCubic',
        start: () => this._titleIsAnimating = true,
        complete: () => this._titleIsAnimating = false,
      });
    }
  }

  private initMarkdown() {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return '<h' + level + '>' +
               '<a name="' + escapedText + '" class="anchor" href="#' + escapedText + '">' +
                 '<span class="header-link"></span>' +
               '</a>' + text +
             '</h' + level + '>';
    };
  }

  private initPushpin() {
    const tableOfContent = $('.table-of-contents');
    // add pushpin
    if (!this._pushpinIsOn && window.innerWidth > 992) {
      const pushpinTop = tableOfContent.parent().offset().top;
      tableOfContent.pushpin({ top: pushpinTop });
      this._pushpinIsOn = true;
    }
    // remove pushpin
    if (this._pushpinIsOn && window.innerWidth <= 992) {
      tableOfContent.pushpin('remove' as any);
      this._pushpinIsOn = false;
    }
  }

  private initScrollSpy() {
    $('section').scrollSpy();
  }
}
