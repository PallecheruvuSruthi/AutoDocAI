import ast

def validate_python(code):
    try:
        ast.parse(code)
        return True, "Valid Python code"
    except Exception as e:
        return False, str(e)