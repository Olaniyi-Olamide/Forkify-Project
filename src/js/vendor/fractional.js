// Fractional.js browser-compatible version
// Source: node_modules/fractional/index.js

export default function Fraction(numerator, denominator) {
  if (typeof numerator !== 'undefined' && denominator) {
    if (typeof numerator === 'number' && typeof denominator === 'number') {
      this.numerator = numerator;
      this.denominator = denominator;
    } else if (
      typeof numerator === 'string' &&
      typeof denominator === 'string'
    ) {
      this.numerator = parseInt(numerator);
      this.denominator = parseInt(denominator);
    }
  } else if (typeof denominator === 'undefined') {
    let num = numerator;
    if (typeof num === 'number') {
      this.numerator = num;
      this.denominator = 1;
    } else if (typeof num === 'string') {
      let a, b;
      let arr = num.split(' ');
      if (arr[0]) a = arr[0];
      if (arr[1]) b = arr[1];
      if (a % 1 === 0 && b && b.match('/')) {
        return new Fraction(a).add(new Fraction(b));
      } else if (a && !b) {
        if (typeof a === 'string' && a.match('/')) {
          let f = a.split('/');
          this.numerator = f[0];
          this.denominator = f[1];
        } else if (typeof a === 'string' && a.match('.')) {
          return new Fraction(parseFloat(a));
        } else {
          this.numerator = parseInt(a);
          this.denominator = 1;
        }
      } else {
        return undefined;
      }
    }
  }
  this.normalize();
}

Fraction.prototype.clone = function () {
  return new Fraction(this.numerator, this.denominator);
};

Fraction.prototype.toString = function () {
  if (this.denominator === 'NaN') return 'NaN';
  let wholepart =
    this.numerator / this.denominator > 0
      ? Math.floor(this.numerator / this.denominator)
      : Math.ceil(this.numerator / this.denominator);
  let numerator = this.numerator % this.denominator;
  let denominator = this.denominator;
  let result = [];
  if (wholepart != 0) result.push(wholepart);
  if (numerator != 0)
    result.push(
      (wholepart === 0 ? numerator : Math.abs(numerator)) + '/' + denominator
    );
  return result.length > 0 ? result.join(' ') : 0;
};

Fraction.prototype.rescale = function (factor) {
  this.numerator *= factor;
  this.denominator *= factor;
  return this;
};

Fraction.prototype.add = function (b) {
  let a = this.clone();
  if (b instanceof Fraction) {
    b = b.clone();
  } else {
    b = new Fraction(b);
  }
  let td = a.denominator;
  a.rescale(b.denominator);
  b.rescale(td);
  a.numerator += b.numerator;
  return a.normalize();
};

Fraction.prototype.subtract = function (b) {
  let a = this.clone();
  if (b instanceof Fraction) {
    b = b.clone();
  } else {
    b = new Fraction(b);
  }
  let td = a.denominator;
  a.rescale(b.denominator);
  b.rescale(td);
  a.numerator -= b.numerator;
  return a.normalize();
};

Fraction.prototype.multiply = function (b) {
  let a = this.clone();
  if (b instanceof Fraction) {
    a.numerator *= b.numerator;
    a.denominator *= b.denominator;
  } else if (typeof b === 'number') {
    a.numerator *= b;
  } else {
    return a.multiply(new Fraction(b));
  }
  return a.normalize();
};

Fraction.prototype.divide = function (b) {
  let a = this.clone();
  if (b instanceof Fraction) {
    a.numerator *= b.denominator;
    a.denominator *= b.numerator;
  } else if (typeof b === 'number') {
    a.denominator *= b;
  } else {
    return a.divide(new Fraction(b));
  }
  return a.normalize();
};

Fraction.prototype.equals = function (b) {
  if (!(b instanceof Fraction)) {
    b = new Fraction(b);
  }
  let a = this.clone().normalize();
  b = b.clone().normalize();
  return a.numerator === b.numerator && a.denominator === b.denominator;
};

Fraction.prototype.normalize = (function () {
  const isFloat = function (n) {
    return (
      typeof n === 'number' &&
      ((n > 0 && n % 1 > 0 && n % 1 < 1) ||
        (n < 0 && n % -1 < 0 && n % -1 > -1))
    );
  };
  const roundToPlaces = function (n, places) {
    if (!places) {
      return Math.round(n);
    } else {
      let scalar = Math.pow(10, places);
      return Math.round(n * scalar) / scalar;
    }
  };
  return function () {
    if (isFloat(this.denominator)) {
      let rounded = roundToPlaces(this.denominator, 9);
      let scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
      this.denominator = Math.round(this.denominator * scaleup);
      this.numerator *= scaleup;
    }
    if (isFloat(this.numerator)) {
      let rounded = roundToPlaces(this.numerator, 9);
      let scaleup = Math.pow(10, rounded.toString().split('.')[1].length);
      this.numerator = Math.round(this.numerator * scaleup);
      this.denominator *= scaleup;
    }
    let gcf = Fraction.gcf(this.numerator, this.denominator);
    this.numerator /= gcf;
    this.denominator /= gcf;
    if (
      (this.numerator < 0 && this.denominator < 0) ||
      (this.numerator > 0 && this.denominator < 0)
    ) {
      this.numerator *= -1;
      this.denominator *= -1;
    }
    return this;
  };
})();

Fraction.gcf = function (a, b) {
  let common_factors = [];
  let fa = Fraction.primeFactors(a);
  let fb = Fraction.primeFactors(b);
  fa.forEach(function (factor) {
    let i = fb.indexOf(factor);
    if (i >= 0) {
      common_factors.push(factor);
      fb.splice(i, 1);
    }
  });
  if (common_factors.length === 0) return 1;
  let gcf = (function () {
    let r = common_factors[0];
    for (let i = 1; i < common_factors.length; i++) {
      r = r * common_factors[i];
    }
    return r;
  })();
  return gcf;
};

Fraction.primeFactors = function (n) {
  let num = Math.abs(n);
  let factors = [];
  let _factor = 2;
  while (_factor * _factor <= num) {
    if (num % _factor === 0) {
      factors.push(_factor);
      num = num / _factor;
    } else {
      _factor++;
    }
  }
  if (num != 1) {
    factors.push(num);
  }
  return factors;
};
