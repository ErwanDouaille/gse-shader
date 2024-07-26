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

import Shell from 'gi://Shell';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

const unused = Symbol('unused');

export class ShaderModifier {

  constructor(actor, path) {
    this._actor = actor;
    this._path = path;

    this._currentShader = {name : "default", fileName : "default.frag" } ;
    this._sliderValue = 0.0;
    this._date = new GLib.DateTime();

    // we deliberately don't apply a shader on construction because
    // if the user has a broken gl compiler or otherwise broken system then
    // the whole screen will freeze.   When that happens, if the user reboots their system and the shader
    // is applied again at startup, it makes recovery very hard for them.   This way, nothing is applied
    // till the menu is used.
  }

  _changeShader(shaderItem) {
    this._removeShader();
    this._currentShader = shaderItem;
    this._applyCurrentShader();
  }

  _applyCurrentShader() {
      this._properties={};
      try {
        this._shaderSource = Shell.get_file_contents_utf8_sync(this._path + "/" + this._currentShader.fileName);
      } catch (e) {
        this._shaderSource = null;
        return;
      }

      if(this._actor) {
        if (!this._actor.get_effect('shader')) {
          // Shader Effect
          this._fx = new Clutter.ShaderEffect({
            shader_type: Clutter.ShaderType.FRAGMENT_SHADER });
          this._fx.set_shader_source(this._shaderSource);
          this._newFrame();
          this._actor.add_effect_with_name('shader',  this._fx);

          this._actor.connect('after-paint', () => this._newFrame());
        }
      }
  }

  // save substantial amounts of CPU by only setting values that are used in the shader, and only if they changed.
  _setProperty(name, value) {
    if (!this._properties.hasOwnProperty(name)) {
      if (!this._shaderSource.includes(name)) {
        this._properties[name] = unused;
      }
    }
    if (this._properties[name]!=value && this._properties[name]!=unused) {
      this._properties[name] = value;
      this._fx.set_uniform_value(name, value);
    }
  }
  _newFrame() {
    if (!this._fx) return;

    this._setProperty('height', this._actor.get_height());
    this._setProperty('width', this._actor.get_width());
    this._setProperty('mouseX',global.get_pointer()[0]);
    this._setProperty('mouseY',global.get_pointer()[1]);
    this._setProperty('globalTime', (new GLib.DateTime()).get_seconds());
    this._setProperty('slider', this._sliderValue);
    this._actor.scale_y = 1.0;

  }

  _removeShader() {
    this._removeShaderNamed('shader');
  }

  destroy() {
    this._removeShader();
  }

  _removeShaderNamed(aShaderName) {
    this._actor.remove_effect_by_name(aShaderName);
  }

  updateSliderValue(value) {
    this._sliderValue = value;
    this._newFrame();
  }

  hasSlider() {
    return this._shaderSource && this._shaderSource.includes('slider');
  }
};
