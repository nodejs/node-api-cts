import { register } from 'node:module';
import 'amaro/strip';

register('./loader.js', import.meta.url);
