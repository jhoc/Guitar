export class jTK_Fraction {
    constructor(_num, _denom) {
        this.m_numerator = _num;
        this.m_denominator = _denom;
    }
    num() {
        return this.m_numerator;
    }
    denom() {
        return this.m_denominator;
    }
    gcd(a, b) {
        if (b == 1)
            return 1;
        if (a < 0) {
            a *= -1;
        }
        if (b < 0) {
            b *= -1;
        }
        while (a != b) {
            // std::cout << "Fraction::gcd while a " << a << ", b " << b << std::endl;
            if (a > b) {
                a -= b;
            }
            else {
                b -= a;
            }
        }
        return a;
    }
    reduce() {
        if (this.m_numerator == 0) {
            this.m_denominator = 4;
            return;
        }
        if (this.m_denominator <= 0)
            return;
        // std::cout << "Fraction::reduce n " << numerator << ", d " << denominator << std::endl;
        var tmp = this.gcd(this.m_numerator, this.m_denominator);
        // std::cout << "Fraction::reduce gcd. n " << numerator << ", d " << denominator << std::endl;
        this.m_numerator = this.m_numerator / tmp;
        this.m_denominator = this.m_denominator / tmp;
        // return *this;
    }
    toNum() {
        return this.m_numerator / this.m_denominator;
    }
    add(_frac) {
        this.m_numerator = this.m_numerator * _frac.denom() + _frac.num() * this.m_denominator;
        this.m_denominator *= _frac.denom();
        this.reduce();
    }
    sub(_frac) {
        this.m_numerator = this.m_numerator * _frac.denom() - _frac.num() * this.m_denominator;
        this.m_denominator *= _frac.denom();
        this.reduce();
    }
    equals(_frac) {
    }
    smallerThan(_frac) {
        if (this.toNum() < _frac.toNum())
            return true;
        return false;
    }
    // get [Symbol.toStringTag]() {
    //   return this.toString();
    // }
    toString() {
        return "(" + this.m_numerator + "/" + this.m_denominator + ")";
    }
}
//# sourceMappingURL=jUITK_Math_Fraction.js.map