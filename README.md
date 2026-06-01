# Sample Next.js App

This app shows a centered label and button. The label starts at `0`, and the
button calls `/quarkus-sample-project/update`. The numeric response from that
endpoint updates the label value.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Calling a Java API from React in Kubernetes

If the React app and Java app are running in Kubernetes, do not call the Java
pod directly by pod IP. Pod IPs are temporary and can change. Use a Kubernetes
`Service` in front of the Java app.

Example Java Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: java-api
spec:
  selector:
    app: java-api
  ports:
    - port: 80
      targetPort: 8080
```

If code running inside the cluster needs to call the Java API, it can use the
service DNS name:

```txt
http://java-api
```

If the Java service is in another namespace:

```txt
http://java-api.<namespace>.svc.cluster.local
```

One important detail: browser-side React code runs in the user's browser, not
inside the Kubernetes cluster. That means the browser usually cannot call
`http://java-api` directly.

For browser-based React apps, the recommended approach is to expose both React
and Java behind the same domain with an Ingress, Gateway, LoadBalancer, or
reverse proxy.

Example routing:

```txt
https://myapp.example.com/          -> React app
https://myapp.example.com/api/...   -> Java service
```

Then React can call the Java API with a same-origin request:

```ts
fetch("/api/update");
```

For this app, the existing call can stay as:

```ts
fetch("/quarkus-sample-project/update");
```

as long as the Kubernetes routing layer forwards
`/quarkus-sample-project/update` to the Java service.

If the Java API is exposed on a separate domain, React can call that full URL:

```ts
fetch("https://api.example.com/quarkus-sample-project/update");
```

In that case, the Java app must allow the React app's origin with proper CORS
configuration.
