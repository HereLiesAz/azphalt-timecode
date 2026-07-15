# My azphalt extension

A **code extension** — a sandboxed filter + transition that runs in any conforming azphalt host. Edit the code, test it locally against the reference runtime, build a `.azp`, and submit it.

## Layout

~~~
manifest.json      # identity, capabilities, and what you contribute (filters/transitions/…)
code/main.js       # your code — one export per contribution, branded with define*
ui/panel.json      # a control panel the host renders as native widgets
LICENSE            # your license
build.js           # packages everything into a .azp
test.js            # runs your contributions against @azphalt/runtime-reference
~~~

## Develop

~~~sh
npm install
npm test     # runs code/main.js against the reference runtime — fast iteration
npm run build   # → my-extension-1.0.0.azp
~~~

`npm test` dispatches your `brightness` filter and `crossfade` transition against a tiny in-memory world and prints the results — no host app required.

## Capabilities — least privilege

`manifest.json`'s `capabilities` is the **only** surface your code can reach; the host grants exactly what you list and denies the rest. This starter uses `bitmap`, `params`, and `canvas`. Add `layers`, `selection`, `color`, `assets`, `time`, or `audio` **only if you use them** — a host prompts the user for anything beyond the baseline, so ask for less. You can never reach the camera, sensors, the filesystem, the network, or the host's engine; those have no API at all.

## Target a specific app

By default the extension is **global** (offered to every host). To scope it to one app — e.g. your own — add its reverse-DNS id to the manifest:

~~~json
"targetApps": ["com.the.app"]
~~~

A repository then shows it only to that app. (It's a discovery filter, not access control.)

## Submit

Open a pull request adding this folder under `submissions/<your-manifest-id>/` in the azphalt repo, using the **code** submission template. CI re-packages and validates it; on merge it's indexed. See the repo's `submissions/README.md`.

## Learn more

- Manifest reference — `spec/extension-manifest.md`
- Capability model (the security boundary) — `spec/capability-model.md`
- UI schema — `spec/ui-schema.md`
