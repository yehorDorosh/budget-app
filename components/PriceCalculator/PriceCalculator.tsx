import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import BaseCard from '../ui/BaseCard'
import CalculatorButton from './CalculatorButton'
import { View, Text, StyleSheet } from 'react-native'

interface Props {
  onPressEqual: (result: number) => void
}

function roundOff(num: number) {
  return Math.round(num * 1e2) / 1e2
}

const PriceCalculator: FC<Props> = ({ onPressEqual }) => {
  const [result, setResult] = useState(0)
  const [input, setInput] = useState('0')

  const addableChars = useMemo(() => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/'], [])
  const operators = useMemo(() => ['+', '-', '*', '/'], [])

  const buttonHandler = useCallback(
    (id: string) => {
      const target = id

      // Add char to query
      if (addableChars.includes(target)) {
        setInput((prev) => {
          if (prev === '0' && !operators.includes(target)) {
            return target
          }
          if (prev === '0' && target === '-') return target
          if (prev === '0' && target === '+') return prev
          if (operators.includes(target) && prev.at(-1) === target) return prev
          return prev + target
        })
      }

      // Add dot to query
      if (target === '.') {
        setInput((prev) => {
          if (prev.length === 0) {
            return '0.'
          }
          if (prev.at(-1) === '.') {
            return prev
          }
          return prev + '.'
        })
      }

      // Clear query
      if (target === 'c') {
        setInput('0')
        setResult(0)
      }

      // Remove last char from query
      if (target === '<-') {
        setInput((prev) => {
          if (new RegExp(/\(-\d{1,}.\d{1,}\)|\(-\d{1,}\)$/g).test(prev)) {
            // look for (-lastArg)
            // delete last arg like (-d.dddd) or (-ddddd)
            return prev.replace(new RegExp(/\(-\d{1,}.\d{1,}\)|\(-\d{1,}\)$/g), '')
          }
          if (prev.length === 1) {
            setResult(0)
            return '0'
          }
          return prev.slice(0, -1)
        })
      }

      if (target === '+/-') {
        setInput((prev) => {
          /**
           * If query not empty and contains operators , then replace last arg with negative arg
           */
          if (operators.some((operator) => prev.includes(operator)) && prev.length > 0) {
            // Split query by operators
            const arg = prev.split(/[-+*()]/g).filter((arg) => arg.length > 0)
            // If last arg is negative, then replace last arg with positive arg
            if (new RegExp(/\(-\d{1,}.\d{1,}\)|\(-\d{1,}\)$/g).test(prev)) {
              // look for (-lastArg)
              // replace (-d.dddd) or (-ddddd) with lastArg
              return prev.replace(new RegExp(/\(-\d{1,}.\d{1,}\)|\(-\d{1,}\)$/g), arg.at(-1) + '')
            }
            // Replace last arg with negative arg
            return prev.replace(new RegExp(arg.at(-1) + '$'), `(-${arg.at(-1)})`)
          }
          return (+prev * -1).toString()
        })
      }
    },
    [addableChars, operators]
  )

  const resultHandler = useCallback(() => {
    // eslint-disable-next-line no-eval
    const result = roundOff(eval(input))
    setResult(result)
    setInput(result.toString())
    onPressEqual(result)
  }, [onPressEqual, input])

  /**
   * If query contains operators and last char is not operator, then calculate result for preview
   */
  useEffect(() => {
    if (operators.some((operator) => input.includes(operator)) && !operators.includes(input.at(-1) + '')) {
      // eslint-disable-next-line no-eval
      const result = roundOff(eval(input))
      setResult(result)
    }
  }, [input, operators])

  return (
    <BaseCard>
      <View style={styles.calc}>
        <Text>Calculator</Text>
        <Text style={styles.output}>{input}</Text>
        <Text>Preview</Text>
        <Text style={styles.output}>{result}</Text>
        <View style={styles.btns}>
          <CalculatorButton btnTxt="+/-" onClick={buttonHandler} style={[styles.btn, styles.bgGray]} />
          <CalculatorButton btnTxt="c" onClick={buttonHandler} style={[styles.btn, styles.bgGray]} />
          <CalculatorButton btnTxt="<-" onClick={buttonHandler} style={[styles.btn, styles.bgGray]} />
          <CalculatorButton btnTxt="/" onClick={buttonHandler} style={[styles.btn, styles.bgOrange]} />
          <CalculatorButton btnTxt="7" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="8" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="9" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="*" onClick={buttonHandler} style={[styles.btn, styles.bgOrange]} />
          <CalculatorButton btnTxt="4" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="5" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="6" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="-" onClick={buttonHandler} style={[styles.btn, styles.bgOrange]} />
          <CalculatorButton btnTxt="1" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="2" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="3" onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="+" onClick={buttonHandler} style={[styles.btn, styles.bgOrange]} />
          <CalculatorButton btnTxt="0" onClick={buttonHandler} style={[styles.btn, styles.zero]} />
          <CalculatorButton btnTxt="." onClick={buttonHandler} style={[styles.btn, styles.bgBlue]} />
          <CalculatorButton btnTxt="=" onClick={resultHandler} style={[styles.btn, styles.bgRed]} />
        </View>
      </View>
    </BaseCard>
  )
}

const btnWidth = '23%'

const styles = StyleSheet.create({
  calc: {},
  output: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'right'
  },
  btns: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btn: {
    margin: '1%'
  },
  zero: {
    backgroundColor: '#00f',
    width: '48%'
  },
  bgGray: {
    backgroundColor: '#ccc',
    width: btnWidth
  },
  bgRed: {
    backgroundColor: '#f00',
    width: btnWidth
  },
  bgOrange: {
    backgroundColor: '#f60',
    width: btnWidth
  },
  bgYellow: {
    backgroundColor: '#ff0',
    width: btnWidth
  },
  bgBlue: {
    backgroundColor: '#00f',
    width: btnWidth
  }
})

export default PriceCalculator
