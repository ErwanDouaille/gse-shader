//  GNOME Shell Extension Shader
//  Copyright (C) 2016 douaille
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
//  Douaille Erwan <douailleerwan@gmail.com>

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as ShaderMenu from './shaderMenu.js';
import * as ShaderModifier from './shaderModifier.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

let shaderMenu;
let shaderModifier;

export default class ShaderExtension extends Extension {
  enable() {
    shaderModifier = new ShaderModifier.ShaderModifier(global.stage, this.path);
    shaderMenu = new ShaderMenu.ShaderMenu(shaderModifier, this.path);
    Main.panel.addToStatusArea('shaderMenu', shaderMenu);
  }

  disable() {
    shaderMenu.destroy();
    shaderModifier.destroy();
  }
}
