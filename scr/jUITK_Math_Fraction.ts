
export class jTK_Fraction{
  m_numerator : number;
  m_denominator : number;
    constructor( _num: number, _denom: number ) {
        this.m_numerator = _num;
        this.m_denominator = _denom;
    }

num() : number {
    return this.m_numerator;
}
denom() : number {
    return this.m_denominator;
}

    gcd( a: number , b: number  ) : number {
        if( b == 1 ) return 1;
        if( a < 0 ) {
          a *= -1;
        }
        if( b < 0 ) {
          b *= -1;
        }
        while (a != b) {
          // std::cout << "Fraction::gcd while a " << a << ", b " << b << std::endl;
            if (a > b) {
              a -= b;
            } else {
              b -= a;
            }
          }
          return a;
    }

reduce() : void {
    if( this.m_numerator == 0 ) {
        this.m_denominator = 4;
        return;
      }
      if( this.m_denominator <= 0 ) return;
      // std::cout << "Fraction::reduce n " << numerator << ", d " << denominator << std::endl;
      var tmp: number = this.gcd( this.m_numerator, this.m_denominator );
      // std::cout << "Fraction::reduce gcd. n " << numerator << ", d " << denominator << std::endl;
       this.m_numerator = this.m_numerator / tmp;
       this.m_denominator = this.m_denominator / tmp;
    
       // return *this;
    }

    toNum() : number {
      return this.m_numerator / this.m_denominator;
    }

    add( _frac: jTK_Fraction ) : void {
        this.m_numerator = this.m_numerator * _frac.denom() + _frac.num() * this.m_denominator;
        this.m_denominator *= _frac.denom();
        this.reduce();
    }

    sub( _frac: jTK_Fraction ) : void {
        this.m_numerator = this.m_numerator * _frac.denom() - _frac.num() * this.m_denominator;
        this.m_denominator *= _frac.denom();
        this.reduce();
    }

    equals( _frac: jTK_Fraction ) : void {

    }

    smallerThan( _frac: jTK_Fraction ) : boolean {
      if( this.toNum() < _frac.toNum() ) return true;
      return false;
    }

    // get [Symbol.toStringTag]() {
    //   return this.toString();
    // }
 
    toString() : string {
      return "(" + this.m_numerator + "/" + this.m_denominator + ")";
    }

    // valueOf() {
    //   return this.toString();
    // }

    // toLocaleString() {
    //   return this.toString();
    // }

}