/**
 * syntax const classes = useClassLister(styles)
 * then -> className={classes('foo', 'bar')}
 * @param stylesObject the
 * @returns {function void(...listOfClasses) {
    @returns string
 }}
 */
export const useClassLister = (stylesObject: CSSModuleClasses) => (...classList: string[]): string => {
  return classList.reduce((a, myClass) => {
    let output = a;
    if (stylesObject[myClass]) {
      if (a) output += ' ';
      output += stylesObject[myClass]
    }
    return output;
  }, '')
}
