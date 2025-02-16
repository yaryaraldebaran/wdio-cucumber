type VariableKey = string;
type VariableValue = string | number | boolean; // Example of specific types

class GlobalVariables {
    private variables: { [key: VariableKey]: VariableValue };

    constructor() {
        this.variables = {};
    }

    setVariable(key: VariableKey, value: VariableValue): void {
        if (this.variables[key] === undefined) {
            console.log(`Adding new variable: ${key}`);
        } else {
            console.log(`Variable already exists, updating: ${key}`);
        }
        this.variables[key] = value;
    }

    getVariable(key: VariableKey): VariableValue | undefined {
        return this.variables[key];
    }
}

const globalVariables = new GlobalVariables();
export default globalVariables;