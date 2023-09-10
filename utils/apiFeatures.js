class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    if (this.queryString.category) {
      this.query = this.query.find({ category: this.queryString.category });
    }

    if (this.queryString.brand) {
      this.query = this.query.find({ brand: this.queryString.brand });
    }
    return this;
  }

  sort() {
    if (this.queryString._sort && this.queryString._order) {
      this.query = this.query.sort({
        [this.queryString.__sort]: this.queryString._order,
      });
    }
    return this;
  }

  paginate() {
    if (this.queryString._page && this.queryString._limit) {
      const pageSize = this.queryString._limit * 1;
      const page = this.queryString._page * 1;
      this.query = this.query.skip(pageSize * (page - 1)).limit(pageSize);
    }

    return this;
  }
}

module.exports = APIFeatures;
