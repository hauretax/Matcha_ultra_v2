# Matcha project


## Route 
data Type can be found in comon_src/type
### user register:
creat new profile
```mermaid
flowchart TD
    A[POST /api/register] 
    A-->|Error| B(JSON error message)
    A-->|SUCCES| C(JSON succes message)
    D(data Type: UserReqRegister) -->A
```
### validate email:
give to user a way to become validate
```mermaid
flowchart TD
    A[GET /api/verify-email] 
    A-->|Error| B(redirect to a error page)
    A-->|SUCCES| C(redirect to a success page)
    D(token: string) -->A
``` 
*
### user login:
give all data needed to use website as a loged user
```mermaid
flowchart TD
    D(data Type: UserReqLogin) -->A
    A[POST /api/login] 
    A-->|Error| B(data Type: *to define*)
    A-->|SUCCES| C(return error message)
``` 
Returns: Upon successful login, return a JSON object with a success message and a user session or JWT token. In case of an error (e.g., incorrect credentials), return an error message.

### ask for reset password:
creat a token send it via mail and stor it
```mermaid
flowchart TD
    D(email: string) -->A
    A[POST /api/request-password-reset] 
    A-->|Error| B(JSON success message)
    A-->|SUCCES| C(JSON success message)
``` 
return a JSON object with a success message

### reset password:
check if token is correct and change password
```mermaid
flowchart TD
    D(email: string) -->A
    A[POST /api/reset-password] 
    A-->|Error| B(JSON error message)
    A-->|SUCCES| C(JSON success message)
``` 

### logout:
unvalidate token data in server side
```mermaid
flowchart TD
    D(none) -->A
    A[POST /api/logout] 
    A-->|Error| B(JSON error message)
    A-->|SUCCES| C(JSON success message)
``` 


## 42 project
### by hutricot and alabalet