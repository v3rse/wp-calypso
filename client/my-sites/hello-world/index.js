import page from 'page'; //External Dependencies

// Internal Dependencies
import controller from 'my-sites/controller';
import helloWorldController from './controller'; //our controller


export default () => {
  page('/hello-world/:domain?', controller.siteSelection,controller.navigation,helloWorldController.helloWorld);
};
