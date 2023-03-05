# TS Pedantic

A library which extends typescript to support error handling patterns found in languages like Rust.

## Roadmap

> **Warning**
> This library is still a work in progress, and I'm building it in public. Please feel free to contribute if you find any issues!

- [ ] Match typesafe autocomplete
- [x] ~Option~
- [x] ~Result~


## Using Option

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
