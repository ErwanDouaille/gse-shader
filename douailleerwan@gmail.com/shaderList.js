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

import Gio from 'gi://Gio';

export class ShaderList {
  constructor(path) {
    this._shaderList = new Array();
    this._dir = Gio.File.new_for_path(path);
    this._fillShaderList();
  }

  _fillShaderList() {
    let fileEnum;
    try {
      fileEnum = this._dir.enumerate_children('', Gio.FileQueryInfoFlags.NONE, null);
    } catch (e) {
      fileEnum = null;
    }
    if (fileEnum != null) {
      let info;
      while ((info = fileEnum.next_file(null)))
        if(info.get_name().endsWith(".frag")){
          let str = info.get_name().replace(".frag", "");
          this._shaderList.push({name : str, fileName : info.get_name()});
        }
      this._shaderList.sort(function(a, b){return a.name > b.name});
    }
  }

  refreshList() {
    this._shaderList = new Array();
    this._fillShaderList();
  }

  getShaderList() {
    return this._shaderList;
  }
}
