## [0.12.1](https://github.com/nexxar/vue3-oop-component/compare/release/v0.12.0...release/v0.12.1) (2022-12-12)


### Bug Fixes

* **builder:** block re-use of same builder ([880320f](https://github.com/nexxar/vue3-oop-component/commit/880320ff6450e116b8e754871521c395bf4db62f))
* **builder:** enable overwrite of defined props ([4916530](https://github.com/nexxar/vue3-oop-component/commit/49165306b84c663824cfba5cc6231833815a1916))
* **builder:** make value-properties responsive ([cb9248b](https://github.com/nexxar/vue3-oop-component/commit/cb9248b98181be2871efcf772c8d9d582694d89c))
* **builder:** re-use reactive of passed instance ([25af93a](https://github.com/nexxar/vue3-oop-component/commit/25af93a32999e67fc7d6256709fd7d81f160a39c))
* **builder:** reset finalised flag for new instance ([e9ff44e](https://github.com/nexxar/vue3-oop-component/commit/e9ff44e935e4ed2ba7ce0410916b515691c33321))
* **decorator:** fix detection of getter/setter computed ([eed666f](https://github.com/nexxar/vue3-oop-component/commit/eed666fac74c35e3e7ccca597a8f6c7d17cc985f))
* **render:** do not hide props prefixed "_" or "$" ([528a093](https://github.com/nexxar/vue3-oop-component/commit/528a093bf610ff11b73e94837edaf9c0bd65a3d4))
* **render:** proxied context return unique ownKeys ([6bd767d](https://github.com/nexxar/vue3-oop-component/commit/6bd767d9d24d2f85f262886474b416f369566c5a))
* **render:** wrap `raw` of reactive as render context ([8272eaf](https://github.com/nexxar/vue3-oop-component/commit/8272eaf14a410ffa13488f2c6f6f292a1f47a0da))
* **setup:** run static `beforeCreate` hooks ([7e69c64](https://github.com/nexxar/vue3-oop-component/commit/7e69c64078bbf2fe97f8671316bf81a7e38deaad))
* upgrade dev dependencies to most recent versions ([27cc4cd](https://github.com/nexxar/vue3-oop-component/commit/27cc4cd94d5dee2a4879fa15085a2b5d584bb274))
* **utils:** detecting inherited props ignore `Object` ([41882a8](https://github.com/nexxar/vue3-oop-component/commit/41882a8da3201518eb612f546ce0626c9fdf3d3c))
* **utils:** type hints collecting static functions ([15ed1d5](https://github.com/nexxar/vue3-oop-component/commit/15ed1d54ecf45cf93c542aa6ccc8d6a6459d4fad))
* **watcher:** use proper this context for handler ([65d9a5e](https://github.com/nexxar/vue3-oop-component/commit/65d9a5ef05967941b3b78886a7415fd92d051643))



# [0.12.0](https://github.com/nexxar/vue3-oop-component/compare/release/v0.11.1...release/v0.12.0) (2022-11-24)


### Bug Fixes

* add some type casts where necessary ([bcf5e7b](https://github.com/nexxar/vue3-oop-component/commit/bcf5e7b30b68fb3bf7e028ec74a5b7006664953c))
* **comment:** fix typo in comment ([a5e9e4c](https://github.com/nexxar/vue3-oop-component/commit/a5e9e4c43262c1105869e9b879119448c0f024b6))
* **decorator:** remove unused local variable ([23b5155](https://github.com/nexxar/vue3-oop-component/commit/23b515563321d38efdeeb16f16c580ecae20ded1))
* **decorator:** scope decorator to constructor ([fbe42f7](https://github.com/nexxar/vue3-oop-component/commit/fbe42f70f3c3ac525f84b78e40e6d1bc43ee80e1))
* **legacy render:** fix typo in `legacyFunction` ([ca8837f](https://github.com/nexxar/vue3-oop-component/commit/ca8837f61b335214ec14ceff1fe95294b2c1d0d7))
* **lint:** avoid using "!" to suppress null check ([676760c](https://github.com/nexxar/vue3-oop-component/commit/676760c2a84dd8e78e2a8e08730ba9ed3314038a))
* **test:** remove unused imports ([31fc1e6](https://github.com/nexxar/vue3-oop-component/commit/31fc1e633a269cb269d2fe43dcb3c9d82e797621))
* **test:** replace `any` with `unknown` or remove ([4b78e66](https://github.com/nexxar/vue3-oop-component/commit/4b78e661eeccf47ec5b9bda24ab9e5bcbc6fb34a))


* refactor(utilty)!: remove unused utility type ([8b0c7a3](https://github.com/nexxar/vue3-oop-component/commit/8b0c7a39695ca5e40869e653aa7702ab338897c8))
* refactor(builder)!: init component builder optional ([52caf66](https://github.com/nexxar/vue3-oop-component/commit/52caf66372e19d9013924f3bbca24ee2f13603b9))
* fix(vue)!: make Vue type compatible with Vue 3 ([3aba22f](https://github.com/nexxar/vue3-oop-component/commit/3aba22f085e06a5114dddb4b916b2aabdd0dc301))


### Features

* provide utility func `isVueClassComponent` ([01ba146](https://github.com/nexxar/vue3-oop-component/commit/01ba1460c04e19d5bc184b3efc98784571ad53ba))


### BREAKING CHANGES

* removed unused utility type

Signed-off-by: Nikolaus Rosenmayr <nr@firecoder.com>
* init builder with instance is optional

Signed-off-by: Nikolaus Rosenmayr <nr@firecoder.com>
* type of Vue has changed!

Signed-off-by: Nikolaus Rosenmayr <nr@firecoder.com>



## [0.11.1](https://github.com/nexxar/vue3-oop-component/compare/release/v0.11.0...release/v0.11.1) (2022-11-24)


### Bug Fixes

* **builder:** bind `this` context for render instance ([c143f71](https://github.com/nexxar/vue3-oop-component/commit/c143f718ee33e099735d0455ac9da6f49c828136))
* **builder:** build patched context for rendering ([670b71d](https://github.com/nexxar/vue3-oop-component/commit/670b71db43ccbeb904462a1174b78961b83f4c26))


* fix(vue)!: remove string-index on Vue ([ce12214](https://github.com/nexxar/vue3-oop-component/commit/ce1221418d652bcb183ac9dfcab2596b50d51bed))


### Features

* **component:** custom render func calls parent ([960f292](https://github.com/nexxar/vue3-oop-component/commit/960f292b0de7fecf65dadc7470a9248b150c5f28))
* **utils:** new function to get all inherited props ([c9276c2](https://github.com/nexxar/vue3-oop-component/commit/c9276c211ae3240361178167d8b453dda077f98e))
* **vue:** introduce check for Vue instance ([c97ddf2](https://github.com/nexxar/vue3-oop-component/commit/c97ddf2d338862c4821fd91b86bbf0b89022e460))


### BREAKING CHANGES

* the index is removed on Vue interface.

Signed-off-by: Nikolaus Rosenmayr <nr@firecoder.com>



# [0.11.0](https://github.com/nexxar/vue3-oop-component/compare/release/v0.10.0...release/v0.11.0) (2022-11-24)


### Bug Fixes

* **component:** always apply props in decorator ([4ac8502](https://github.com/nexxar/vue3-oop-component/commit/4ac8502d08c2a3e99264cbe696e0fff7fe94998f))
* **vue:** dummy render func use real arguments ([f92fbf7](https://github.com/nexxar/vue3-oop-component/commit/f92fbf78ef85f094964a8e3ab43f97c61906fd82))


### Features

* **component:** add component class to __vccOpts ([69462b0](https://github.com/nexxar/vue3-oop-component/commit/69462b0fb37702e28d4f69d48c890bc3350628a3))



# [0.10.0](https://github.com/nexxar/vue3-oop-component/compare/release/v0.9.2...release/v0.10.0) (2022-11-24)


### Features

* **render:** add dummy type "ScopedSlot" ([7f39ac6](https://github.com/nexxar/vue3-oop-component/commit/7f39ac629dba6392e412dcd449c98f08c0a59fb6))
* **render:** call custom render hook ([12a0940](https://github.com/nexxar/vue3-oop-component/commit/12a09407a9d6d29cee920db42a3ad2dc4e35c0f5))
* **setup:** provide SetupContext to component ([4d6308a](https://github.com/nexxar/vue3-oop-component/commit/4d6308ab25918cb83e8c17316f201cf7166cfa4a))



## [0.9.2](https://github.com/nexxar/vue3-oop-component/compare/59e5705c12a75b1150f07e43399a095cfc4a9b1e...release/v0.9.2) (2022-11-24)


### Bug Fixes

* **build:** rename `preinstall` script ([e5ef6c1](https://github.com/nexxar/vue3-oop-component/commit/e5ef6c1e74897ca26e5b78b850021fe055df65d5))
* **decorator:** use ES5 decorator types ([a5fc2b0](https://github.com/nexxar/vue3-oop-component/commit/a5fc2b070e1a321a6fa98785a686a58f67f32729))
* **init:** use of reactive wrapper ([1fc7ea4](https://github.com/nexxar/vue3-oop-component/commit/1fc7ea45c103bb274d2a609193e22f24842b4291))
* **life-cycle:** add missing renderTriggered hook ([f9b1a47](https://github.com/nexxar/vue3-oop-component/commit/f9b1a4745c3817c039d8dd62393c5b4db86c511c))
* **mixin:** correct path to imported file ([3aeb7c5](https://github.com/nexxar/vue3-oop-component/commit/3aeb7c5534f745e075c169ac817bbacbba4a0162))
* **render:** remove "writable" from prop definition ([1969658](https://github.com/nexxar/vue3-oop-component/commit/19696581065beefd4efcd8f65cf1220f26e005a0))
* **vue:** _applyProperties use `toRaw(this)` ([2115e29](https://github.com/nexxar/vue3-oop-component/commit/2115e290ba4ae49fb249a4408f616fcd9124d56f))
* **vue:** `VueComponentBaseImpl` instance without Vue ([98c813b](https://github.com/nexxar/vue3-oop-component/commit/98c813bfd4bbcda996edd9383339029246edfd85))
* **vue:** ignore setting new value for property ([e24fd4e](https://github.com/nexxar/vue3-oop-component/commit/e24fd4e34a651ea0734aef8c91cb4b8a375bba75))


### Features

* **builder:** get component options from class ([eccdccb](https://github.com/nexxar/vue3-oop-component/commit/eccdccba2d8959267b808e9a2679acc637c403e3))
* **builder:** init watchers at the end of setup ([5859290](https://github.com/nexxar/vue3-oop-component/commit/58592903aa7a0aed50e1b206aa641d122fa2dc41))
* **builder:** introduce property `instance` ([689ee00](https://github.com/nexxar/vue3-oop-component/commit/689ee0089afbeffaef9a5a8bbb020c998816d9cf))
* **builder:** let builder create instance ([6d145d1](https://github.com/nexxar/vue3-oop-component/commit/6d145d12864cf50da2d3d12fa9b4357b26ff904f))
* **builder:** use component class with builder ([6e13e6f](https://github.com/nexxar/vue3-oop-component/commit/6e13e6f6ea5e1428aab376a0fc8127a740880682))
* **class:** collect instance methods from class ([b85de56](https://github.com/nexxar/vue3-oop-component/commit/b85de562b398f8df8ba45edc5c5f90c72516e869))
* **component:** introduce builder for setup ([b59f375](https://github.com/nexxar/vue3-oop-component/commit/b59f3753fdcb113b1998bc7b084c6dff8ff87b4a))
* consume data definitions ([39ba4cd](https://github.com/nexxar/vue3-oop-component/commit/39ba4cd2ed9ce77865792b72d7f22bc16ca71b61))
* **decorator:** implement `Component` decorator ([76dfb4a](https://github.com/nexxar/vue3-oop-component/commit/76dfb4a352d157b2460337b58927b1184f120614))
* **decorator:** provide methods to decorators ([9d85e03](https://github.com/nexxar/vue3-oop-component/commit/9d85e03a2166c9089bc4ac59882589b9ef896f79))
* first draft to mimic Vue2 component-decorator ([59e5705](https://github.com/nexxar/vue3-oop-component/commit/59e5705c12a75b1150f07e43399a095cfc4a9b1e))
* introduce instance for composition API ([692f887](https://github.com/nexxar/vue3-oop-component/commit/692f8879c3b8d19f46a4cd086008d77f58e31d55))
* introduce life-cycle function mapper ([351aa26](https://github.com/nexxar/vue3-oop-component/commit/351aa26bc098f67c1611c5b5d44c9a440a40d169))
* **life-cycle:** introduce `isInternalHookName` ([ad407ea](https://github.com/nexxar/vue3-oop-component/commit/ad407ea283eaad73bcca8182f12d807a66697aee))
* map "computed" option API to composition API ([0580b78](https://github.com/nexxar/vue3-oop-component/commit/0580b78afaf35720fd0f4751ebbb9d06013ba196))
* map "inject" option API to composition API ([6b138c7](https://github.com/nexxar/vue3-oop-component/commit/6b138c7483390e32918c45d14e11ca6ebc397bf9))
* map "provide" option API to composition API ([359f8ae](https://github.com/nexxar/vue3-oop-component/commit/359f8ae5f2893fca08998b3370badb6edd8b51f1))
* map life-cycle hooks to composition API ([4daff84](https://github.com/nexxar/vue3-oop-component/commit/4daff84cefbd8d2e9a55904908c8f03d1f2a03a2))
* map watcher definitions to composition API ([0e65b3e](https://github.com/nexxar/vue3-oop-component/commit/0e65b3e8454ecf90e70adf0e8b7e4fc80234d50b))
* **options:** Custom setup function received builder ([79f3be6](https://github.com/nexxar/vue3-oop-component/commit/79f3be618818bd47d7ac764a6044a0d3b22cc62a))
* traverse prototypes to find functions ([7d92161](https://github.com/nexxar/vue3-oop-component/commit/7d92161e7776341ab028a35d1323883703d2f41b))
* **utility:** introduce `defineNewLinkedProperties` ([43075e4](https://github.com/nexxar/vue3-oop-component/commit/43075e417676faa82f2f9d5f4c09c67e0c9888a9))
* **utils:** dynamic access parent class function ([a50a5f8](https://github.com/nexxar/vue3-oop-component/commit/a50a5f899b9d8ac067154825784d02e59d6efbd0))
* **utils:** introduce merging of multiple functions ([e0719d2](https://github.com/nexxar/vue3-oop-component/commit/e0719d255870aa01aa48ac3695f06e4ab17b3c51))
* **utils:** proxy to read missing from alternative ([fa4f27a](https://github.com/nexxar/vue3-oop-component/commit/fa4f27a1432a8a057fa12ed5a76a604e28912dfd))
* **vue:** add legacy `InjectKey`+`Constructor` ([5241dc6](https://github.com/nexxar/vue3-oop-component/commit/5241dc65f8966825d4cce46c5aef8c1e90b39cfe))
* **vue:** define and export `ObjectProvideOptions` ([ad79a6e](https://github.com/nexxar/vue3-oop-component/commit/ad79a6e080858af26df6212cd000485e88890ab6))
* **vue:** implement base class ([0befb23](https://github.com/nexxar/vue3-oop-component/commit/0befb23e42ed846eb5fdc72bb1a7d8f58bd6d3ba))
* **vue:** implement base class constructor ([f51ce7f](https://github.com/nexxar/vue3-oop-component/commit/f51ce7f95a666ddbfb2f0ec57f53ed71656236c1))
* **vue:** implement base custom "setup" function ([db50df3](https://github.com/nexxar/vue3-oop-component/commit/db50df37698fb0cf11c6b0ee871feb634ad04e8b))
* **vue:** support legacy rendering functions ([ec14f61](https://github.com/nexxar/vue3-oop-component/commit/ec14f61562b48457e7192ec776a6d8d85516e192))



