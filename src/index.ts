import * as readline from 'readline'

// Decorator to retry on invalid input
function RetryOnInvalidInput(errorMessage: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor?: PropertyDescriptor,
  ) {
    if (!descriptor) return
    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      while (true) {
        try {
          const result = await originalMethod.apply(this, args)
          return result
        } catch (error) {
          console.error(errorMessage)
        }
      }
    }
  }
}

// Handler for console input and output
class ConsolePrompter {
  private rl: readline.Interface

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  askQuestion(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query + ' ', (answer) => {
        resolve(answer)
      })
    })
  }

  close() {
    this.rl.close()
  }
}

// All the logic is encapsulated in here
class TipCalculator {
  constructor(
    private billAmount: number,
    private tipPercentage: number,
    private numPeople: number,
  ) {}

  calculateTip(): number {
    return this.billAmount * (this.tipPercentage / 100)
  }

  calculateTotal(): number {
    return this.billAmount + this.calculateTip()
  }

  amountPerPerson(): number {
    return this.calculateTotal() / this.numPeople
  }
}

// Uses the RetryOnInvalidInput decorator to ensure valid input
class UserInputHandler {
  constructor(private prompter: ConsolePrompter) {}

  @RetryOnInvalidInput('Please enter a positive number.')
  async getBillAmount(): Promise<number> {
    const input = await this.prompter.askQuestion(
      'What is the bill amount? (E.g. 100.00)',
    )
    const amount = parseFloat(input)
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Invalid bill amount')
    }
    return amount
  }

  @RetryOnInvalidInput('Please enter a number between 0 and 100.')
  async getTipPercentage(): Promise<number> {
    const input = await this.prompter.askQuestion(
      'What percentage of tip will you give? (e.g., 15 for 15%)',
    )
    const percentage = parseFloat(input)
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      throw new Error('Invalid tip percentage')
    }
    return percentage
  }

  @RetryOnInvalidInput('Please answer yes or no.')
  async shouldSplitBill(): Promise<boolean> {
    const input = await this.prompter.askQuestion(
      'Should the bill be split? (yes/no)',
    )
    const normalized = input.trim().toLowerCase()
    if (normalized === 'yes' || normalized === 'y') {
      return true
    } else if (normalized === 'no' || normalized === 'n') {
      return false
    } else {
      throw new Error('Invalid input')
    }
  }

  @RetryOnInvalidInput('Please enter a number greater than 1.')
  async getNumPeople(): Promise<number> {
    const input = await this.prompter.askQuestion(
      'How many people will split the bill?',
    )
    const numPeople = parseInt(input, 10)
    if (isNaN(numPeople) || numPeople < 2) {
      throw new Error('Invalid number of people')
    }
    return numPeople
  }
}

function displaySummary(calculator: TipCalculator) {
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

  console.log('\n--- Tip Calculation Summary ---')
  console.log(`Check Amount: ${formatCurrency(calculator['billAmount'])}`)
  console.log(`Tip Percentage: ${calculator['tipPercentage']}%`)
  console.log(`Tip Amount: ${formatCurrency(calculator.calculateTip())}`)
  console.log(`Total Bill: ${formatCurrency(calculator.calculateTotal())}`)

  if (calculator['numPeople'] > 1) {
    console.log('Divide among people: yes')
    console.log(`Split between how many people: ${calculator['numPeople']}`)
    console.log(
      `Each person pays: ${formatCurrency(calculator.amountPerPerson())}`,
    )
  } else {
    console.log('Divide among people: no')
  }

  console.log('-----------------------------')
}

async function main() {
  const prompter = new ConsolePrompter()
  const inputHandler = new UserInputHandler(prompter)

  // Data Collection
  const billAmount = await inputHandler.getBillAmount()
  const tipPercentage = await inputHandler.getTipPercentage()
  const shouldSplit = await inputHandler.shouldSplitBill()

  const numPeople = shouldSplit ? await inputHandler.getNumPeople() : 1

  // Processing Data
  const calculator = new TipCalculator(billAmount, tipPercentage, numPeople)

  // View
  displaySummary(calculator)

  prompter.close()
}

main()
