<p align="center">
  <h1 align="center">TS Pedantic</h1>
  <p align="center">
    <br/>
    Rust like error handling for Typescript.
  </p>
</p>

<p align="center">
  <a href="https://img.shields.io/npm/v/ts-pedantic" rel="nofollow">
    <img src="https://img.shields.io/npm/v/ts-pedantic" alt="npm version">
  </a>
  <a href="https://img.shields.io/github/license/Renni771/ts-pedantic" rel="nofollow">
    <img src="https://img.shields.io/github/license/Renni771/ts-pedantic" alt="License">
  </a>
</p>

<br/>

## Rationale

Options and Results encourage more pedantic error handling. Most importantly, your code indicates whether a function
can throw, and in that case exactly what those errors are, at the type level. These patterns encourage you to handle errors meticulously
and to write more declarative code with easy APIs telling readers what is to be done in most common error cases. Options and Results prevent
the need for `try...catch` blocks everywhere.

## Using Option

We use an `Option` type when we only care about the value. If we get back a `None`, we know there is no value and aren't concerned with
why the value is empty.

```typescript
type User = {
  id: string;
  name: string;
};

const getUserOption = (id: string): Option<User> => {
  if (id === '000') {
    return none();
  }

  return some({
    id: '123',
    name: 'John Wick'
  });
};

const userOption = getUserOption('123');
if (userOption.isSome) {
  const user = userOption.value;
  // ^? type user = User
}
```

## Using Result

`Result` types can be seen as an extension of `Option` where we're also concerned with the possible causes of an error.

```typescript
type User = {
  id: string;
  name: string;
};

interface DbReadError extends Error {
  id: string;
}

const getUserResult = (id: string): Result<User, DbReadError> => {
  if (id === '000') {
    return error({
      name: 'DbReadError',
      message: 'This id cannot be used',
      id: 'some-id'
    });
  }

  return ok({
    id: '123',
    name: 'John Wick'
  });
};

// You can imperatively handle the result like so:
const userResult = getUserResult('john');
if (userResult.isOk) {
  const user = userResult.value;
  // ^? type user = User
} else {
  const error = userResult.error;
  // ^? type error = DbReadError
}
```

## To `Option` or to `Result`?

`Result` basically has all the superpowers of `Option` but with added functionality. When to use either is a question
of what tool to use for what job. Use the primitive that best suits your current use-case.

## Using Match

You can use `match` on an `Option` or `Result` type to declaratively handle the different cases like so:

```typescript
match(userOption, {
  onSome: (user) => {
    console.log(user);
  },
  onNone: () => {
    console.error('No user found');
  }
});

match(userResult, {
  onOk: (user) => {
    console.log(user);
  },
  onError: (error) => {
    console.error(`User not found. Cause: ${error}`);
  }
});
```
