import View from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', 'right', currPage + 1);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev', 'left', currPage - 1);
    }

    // Other page
    if (currPage < numPages) {
      return `
         ${this._generateMarkupBtn('prev', 'left', currPage - 1)}
         ${this._generateMarkupBtn('next', 'right', currPage + 1)}
         `;
    }

    // Page 1, and no other pages
    return '';
  }

  _generateMarkupBtn(pos, dir, page) {
    return `
      <button data-goto="${page}" class="btn--inline pagination__btn--${pos}">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-${dir}"></use>
            </svg>
            <span>Page ${page}</span>
          </button>
`;
  }
}

export default new PaginationView();
