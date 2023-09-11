// 
module.exports = {
    format_date: date => {
      return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
        date
      ).getFullYear()}`;
    },

    format_plural: (word, amount) => {
        if (amount !== 1) {
          return `${word}s`;
        }
    
        return word;
      },

      format_url: url => {
        return url
          .replace('http://', '')
          .replace('http://', '')
          .replace('https://', '')
          .replace('www.', '')
          .split('/')[0]
          .split('?')[0];
      },

      ifCond: function (v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return v1 == v2 ? options.fn(this) : options.inverse(this);
          case '===':
            return v1 === v2 ? options.fn(this) : options.inverse(this);
          case '!=':
            return v1 != v2 ? options.fn(this) : options.inverse(this);
          case '!==':
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
          case '<':
            return v1 < v2 ? options.fn(this) : options.inverse(this);
          case '<=':
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
          case '>':
            return v1 > v2 ? options.fn(this) : options.inverse(this);
          case '>=':
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
          case '&&':
            return v1 && v2 ? options.fn(this) : options.inverse(this);
          case '||':
            return v1 || v2 ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      
  }
}

